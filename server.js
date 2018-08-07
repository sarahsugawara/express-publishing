const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');

const pp = x => JSON.stringify(x, null, 2);
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());
app.use(errorhandler());

app.listen(PORT);

const apiRouter = express.Router();
app.use('/api', apiRouter);

const validateArtist = (req, res, next) => {
    const body = req.body.artist;
    if (!body.name || !body.dateOfBirth || !body.biography) {
        res.status(400).send();
    }
    else {
        next();
    }
}

apiRouter.get('/artists', (req, res, next) => {
     db.all("SELECT * FROM Artist WHERE is_currently_employed = 1", (err, rows) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).send({ artists: rows });
    });
});

apiRouter.post('/artists', validateArtist, (req, res, next) => {
    const artist = req.body.artist;
    const name = artist.name;
    const birth = artist.dateOfBirth;
    const biography = artist.biography;
    // console.log(`>>>>>>>> ${pp(artist)}, ${pp(name)}, ${pp(birth)}, ${pp(biography)}`);
    
    db.run(`INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $birth, $biography, $employed)`, 
    {
        $name: name,
        $birth: birth,
        $biography: biography,
        $employed: 1
    },
    function (err) {
        if (err) {
            console.log(`>>>>>>>> failed creation, ${name}, ${birth}, ${biography}`);
        }
        else {
            db.get(`SELECT * FROM Artist WHERE id = ${this.lastID}`,
            (err, row) => {
                if (err) {
                    console.log(`>>>>>>>> failed`);
                    res.status(500).send();
                }
                console.log(`>>>>>>>> ${pp(row)}`);
                res.status(201).send({ artist: row });
            });
        }
    }
    )
});
//! Fails test for an invalid ID
//TODO: Need to validate artistID here
apiRouter.get('/artists/:artistId', (req, res, next) => {
    const artistId = req.body || req.params.artistId;
    if (artistId) {
        db.get("SELECT * FROM Artist WHERE id = $id", 
        {
            $id: artistId
        },
        (err, row) => {
            if (err) {
                res.status(404).send();
            }
            res.status(200).send({ artist: row });
        }
    )
    }
    else {
        res.status(404).send();
    }
});

//TODO: Need to validate artistId here too
// apiRouter.put('/artists/:id', validateArtist, (req, res, next) => {
//     const artistId = req.params.id;
//     const artist = req.body.artist;
//     if (artistId) {
//         db.run("UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $employed WHERE id = $id", 
//         {   
//             $name: artist.name,
//             $dateOfBirth: artist.date_of_birth,
//             $biography: artist.biography,
//             $employed: artist.is_currently_employed,
//             $id: artistId
//         },
//         function (err) {
//             if (err) {
//                 res.status(404).send();
//             }
//             db.get("SELECT * FROM Artist WHERE id = $id", 
//             {
//                 $id: artistId
//             },
//             (err, row) => {
//                 if (err) {
//                     res.status(404).send();
//                 }
//                 res.status(200).send({ artist: row });
//             });
//         }
//         )
//     }
//     else {
//         res.status(404).send();
//     }
// });

apiRouter.delete('/artists/:id', (req, res, next) => {
    const artistId = req.params.id;
    if (artistId) {
        db.run("UPDATE Artist SET is_currently_employed = 0 WHERE id = $id", 
    {
        $id: artistId
    },
    function (err) {
        if (err) {
            res.status(404).send();
        }
        db.get("SELECT * FROM Artist WHERE id = $id", 
        {
            $id: artistId
        },
        (err, row) => {
            if (err) {
                res.status(404).send();
            }
            res.status(200).send({ artist: row });
        });
    });
    }
});


//* Begin Series Routers

// const validateSeries = (req, res, next) => {
//     const newSeries = req.body.series;
//     if (!newSeries || !newSeries.name || !newSeries.description) {
//         res.status(400).send();
//     }
//     next();
// }

apiRouter.get('/series', (req, res, next) => {
    db.all("SELECT * FROM Series", (err, rows) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).send({ series: rows });
    });
});

//! Receiving error that "series" is undefined (within the request body). Same type of error as above.
// apiRouter.post('/series', validateSeries, (req, res, next) => {
//     const newSeries = req.body.series;
//     db.run("INSERT INTO Series (name, description) VALUES ($name, $description)", 
//     {
//         $name: newSeries.name,
//         $description: newSeries.description
//     },
//     function (err) {
//         if (err) {
//             res.status(400).send();
//         }
//         db.get("SELECT * FROM Series WHERE id = $id", 
//         {   
//             $id: this.lastID
//         },
//         (err, row) => {
//             if (err) {
//                 res.status(400).send();
//             }
//             res.status(201).send({ series: row });
//         }
//         );
//     });
// });

//TODO: Need to validate series Id
apiRouter.get('/series/:id', (req, res, next) => {
    const seriesId = req.params.id;
    if (seriesId) {
        db.get("SELECT * FROM Series WHERE id = $id", 
        {
            $id: seriesId
        },
        (err, row) => {
           if (err) {
               res.status(404).send();
           }
           res.status(200).send({ series: row });
        }
    );
    }
    else {
        res.status(404).send();
    }
});

//!Fails because 'series' is undefined
//TODO: Need to validate series Id
// apiRouter.put('/series/:id', validateSeries, (req, res, next) => {
//     const seriesId = req.params.id;
//     const updatedSeries = req.body.series;
//     if (seriesId) {
//         db.run("UPDATE Series SET name = $name, description = $description WHERE id = $id",
//         {
//             $name: updatedSeries.name,
//             $description: updatedSeries.description
//         },
//         function (err) {
//             if (err) {
//                 res.status(400).send();
//             }
//             db.get("SELECT * FROM series WHERE id = $id",
//             {
//                 $id: this.lastID
//             },
//             (err, row) => {
//                 if (err) {
//                     res.status(400).send();
//                 }
//                 res.status(200).send({ series: row });
//             }
//             );
//         }
//         );
//     }
//     else {
//         res.status(404).send();
//     }
// });

apiRouter.delete('/series/:id', (req, res, next) => {
    const seriesId = req.params.id;
    if (seriesId) {
        db.all("SELECT * FROM Issue WHERE series_id = $seriesId", 
        {
            $seriesId: seriesId
        },
        (err, rows) => {
            if (err) {
                res.status(404).send();
            }
            else if (rows) {
                res.status(404).send('Can\'t delete series because it has related issues');
            }
            else if (!rows) {
                db.run("DELETE FROM Series WHERE id = $id IS NULL",
                {
                    $id: seriesId
                },
                (err) => {
                    if (err) {
                        res.status(400).send();
                    }
                    res.status(204).send();
                }
                );
            }
        });
    }
    else {
        res.status(404).send();
    }
});


//* Begin Issues routers

apiRouter.get('/series/:id/issues', (req, res, next) => {
    const seriesId = req.params.id;
    db.all("SELECT * FROM Issue WHERE series_id = $id",
        {
            $id: seriesId
        },
        (err, rows) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (rows) {
            res.status(200).send({ issues: rows });
        }
        else {
            res.status(404).send();
        }
    });
});


module.exports = app;