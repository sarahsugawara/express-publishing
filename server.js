const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const pp = x => JSON.stringify(x, null, 2);
const PORT = process.env.PORT || 4000;

app.listen(PORT);

const apiRouter = express.Router();
app.use('/api', apiRouter);

// const validateArtist = (req, res, next) => {
//     const body = req.body.artist;
//     if (!body.name || !body.date_of_birth || !body.biography || !body.is_currently_employed) {
//         res.status(400).send();
//     }
//     next();
// }

apiRouter.get('/artists', (req, res, next) => {
     db.all("SELECT * FROM Artist WHERE is_currently_employed = 1", (err, rows) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).send({ artists: rows });
    });
});

//! Receiving error that "artist" is undefined (within the request body)
// apiRouter.post('/artists', validateArtist, (req, res, next) => {
//     console.log(`>>>>>>>> request.body is: ${pp(req.body.artist)}`);
//     const artist = req.body.artist;
//     db.run("INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dateOfBirth, $biography, $employed)", 
//     {
//         $name: artist.name,
//         $dateOfBirth: artist.date_of_birth,
//         $biography: artist.biography,
//         $employed: artist.is_currently_employed
//     },
//     function (error) {
//         db.get("SELECT * FROM Artist WHERE id = $id", 
//         {
//             $id: this.lastID
//         },
//         (error, row) => {
//             if (error) {
//                 res.status(500).send();
//             }
//             res.status(201).send({ artist: row });
//         })
//     }
//     )
// });
//! Fails test for an invalid ID
//TODO: Need to validate artistID here
apiRouter.get('/artists/:artistId', (req, res, next) => {
    const artistId = req.body || req.params.artistId;
    if (artistId) {
        db.get("SELECT * FROM Artist WHERE id = $id", 
        {
            $id: artistId
        },
        (error, row) => {
            if (error) {
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
//         function (error) {
//             if (error) {
//                 res.status(404).send();
//             }
//             db.get("SELECT * FROM Artist WHERE id = $id", 
//             {
//                 $id: artistId
//             },
//             (error, row) => {
//                 if (error) {
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
    function (error) {
        if (error) {
            res.status(404).send();
        }
        db.get("SELECT * FROM Artist WHERE id = $id", 
        {
            $id: artistId
        },
        (error, row) => {
            if (error) {
                res.status(404).send();
            }
            res.status(200).send({ artist: row });
        });
    });
    }
});




module.exports = app;