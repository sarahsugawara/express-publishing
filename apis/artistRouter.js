const express = require('express');
const artistRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');



artistRouter.get('/', (req, res, next) => {
     db.all("SELECT * FROM Artist WHERE is_currently_employed = 1", (err, rows) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send({ artists: rows });
        }
    });
});

artistRouter.post('/', (req, res, next) => {
    const artist = req.body.artist;
    const name = artist.name;
    const birth = artist.dateOfBirth;
    const biography = artist.biography;
    
    db.run(`INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $birth, $biography, $employed)`, 
    {
        $name: name,
        $birth: birth,
        $biography: biography,
        $employed: 1
    },
    function (err) {
        if (err) {
            res.status(400).send();
        }
        else {
            db.get(`SELECT * FROM Artist WHERE id = ${this.lastID}`,
            (err, row) => {
                if (err) {
                    res.status(400).send();
                }
                res.status(201).send({ artist: row });
            });
        }
    }
    )
});

//*Validation of artist and sending info from database back to request
artistRouter.param('artistId', (req, res, next, artistId) => {
    db.get("SELECT * FROM Artist WHERE id = $artistId",
    {
        $artistId: artistId
    },
    (err, row) => {
        if (err) {
            next(err);
        }
        else if (row) {
            req.artist = row;
            next();
        }
        else {
            res.status(404).send();
        }
  })
});

artistRouter.get('/:artistId', (req, res, next) => {
    res.status(200).send({ artist: req.artist });
});


artistRouter.put('/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    const artist = req.body.artist;
    const name = artist.name;
    const birth = artist.dateOfBirth;
    const biography = artist.biography;
    const employed = artist.isCurrentlyEmployed === 0 ? 0 : 1;
    // console.log(`>>>>>>>> ${pp(artist)}`);
    if (!name || !birth || !biography) {
        res.status(400).send();
    }
    db.run(`UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $employed WHERE id = $id`, 
        {   
            $name: name,
            $dateOfBirth: birth,
            $biography: biography,
            $employed: employed,
            $id: artistId
        },
        function (err) {
            if (err) {
                res.status(404).send();
            }
            db.get(`SELECT * FROM Artist WHERE id = ${artistId}`, 
            (err, row) => {
                if (err) {
                    res.status(404).send();
                }
                res.status(200).send({ artist: row });
            });
        })
});

artistRouter.delete('/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    db.run(`UPDATE Artist SET is_currently_employed = 0 WHERE id = ${artistId}`, 
    function (err) {
        if (err) {
            next(err);
        }
        else {
            db.get(`SELECT * FROM Artist WHERE id = ${artistId}`, 
            (err, row) => {
                if (err) {
                    res.status(404).send();
                }
                res.status(200).send({ artist: row });
            });
        }
    });
});

module.exports = artistRouter;