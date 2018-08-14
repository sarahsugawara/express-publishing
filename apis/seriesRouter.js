const express = require('express');
const seriesRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const issuesRouter = require('./issuesRouter.js');



seriesRouter.get('/', (req, res, next) => {
    db.all("SELECT * FROM Series", 
    (err, rows) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send({ series: rows });
        }
    });
});

seriesRouter.post('/', (req, res, next) => {
    const newSeries = req.body.series;
    // console.log(`>>>>>>>> ${pp(newSeries)}`);
    db.run(`INSERT INTO Series (name, description) VALUES ($name, $description)`, 
    {
        $name: newSeries.name,
        $description: newSeries.description
    },
    function (err) {
        if (err) {
            res.status(400).send();
        }
        else {
            db.get(`SELECT * FROM Series WHERE id = ${this.lastID}`, 
            (err, row) => {
                if (err) {
                    res.status(400).send();
                }
                res.status(201).send({ series: row });
            });
        };
    });
});

seriesRouter.param('seriesId', (req, res, next, seriesId) => {
    db.get("SELECT * FROM Series WHERE id = $seriesId",
    {
        $seriesId: seriesId
    },
    (err, row) => {
        if (err) {
            next(err);
        }
        else if (row) {
            req.series = row;
            next();
        }
        else {
            res.status(404).send();
        }
  })
});

seriesRouter.get('/:seriesId', (req, res, next) => {
    res.status(200).send({ series: req.series });
});

seriesRouter.put(':seriesId', (req, res, next) => {
    const seriesId = req.params.seriesId;
    const updatedSeries = req.body.series;
        // console.log(`>>>>>>>> ${pp(updatedSeries)}`);
    if (!updatedSeries.name || !updatedSeries.description) {
        res.status(400).send();
    }
    db.run(`UPDATE Series SET name = $name, description = $description WHERE id = $id`,
        {
            $name: updatedSeries.name,
            $description: updatedSeries.description,
            $id: seriesId
        },
        function (err) {
            if (err) {
                console.log(`>>>>>>>> failed in the updating`);
                next(err);
            }
            else {
                db.get(`SELECT * FROM series WHERE id = ${seriesId}`,
                (err, row) => {
                    if (err) {
                        res.status(400).send();
                    }
                    res.status(200).send({ series: row });
                });
            }
        }
        );
});

seriesRouter.delete('/:seriesId', (req, res, next) => {
    const seriesId = req.body && req.params.seriesId;
    db.all(`SELECT * FROM Issue WHERE series_id = ${seriesId}`, 
        (err, rows) => {
            if (err) {
                // console.log(`>>>>>>>> error fetching`);
                res.status(400).send();
            }
            else if (rows) {
                // console.log(`>>>>>>>> has rows`);
                res.status(400).send('Can\'t delete series because it has related issues');
            }
            else if (!rows) {
                // console.log(`>>>>>>>> doesn't have rows!`);
                db.run(`DELETE FROM Series WHERE id = ${seriesId} IS NULL`,
                (err) => {
                    if (err) {
                        // console.log(`>>>>>>>> failed to delete`);
                        res.status(400).send();
                    }
                    else {
                        // console.log(`>>>>>>>> succeeded deleting`);
                        res.status(204).send();
                    }
                }
                );
            }
        });
    });



module.exports = seriesRouter;