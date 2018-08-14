const express = require('express');
const issuesRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


// const validateIssue = (req, res, next) => {
//     const newIssue = req.body.issues;
//     if (!newIssue || !newIssue.name || !newIssue.issue_number || newIssue.publication_date || newIssue.artist_id) {
//         console.log(`>>>>>>>> issue info is incomplete`);
//         res.status(400).send();
//     }
//     console.log(`>>>>>>>> valid issue`);
//     next();
// };

// const validateSeriesId = (req, res, next) => {
//     const seriesId = req.params.seriesId;
//     console.log(`>>>>>>>> ${pp(seriesId)}`);
//     // db.get(`SELECT * FROM Series WHERE id = ${seriesId}`, 
//     // (err, row) => {
//     //     if (err) {
//     //         console.log(`>>>>>>>> series Id error`);
//     //         res.status(404).send();
//     //     }
//     //     else if (!row) {
//     //         console.log(`>>>>>>>> no such series id`);
//     //         res.status(404).send();
//     //     }
//     //     else if (row) {
//     //         console.log(`>>>>>>>> has a matching series id`);
//     //         next();
//     //     }
//     // });
// };

// apiRouter.get('/series/:seriesId/issues', validateSeriesId, (req, res, next) => {
//     const seriesId = req.params.seriesId;
//     console.log(`>>>>>>>> ${pp(seriesId)}`);
//     // db.all(`SELECT * FROM Issue WHERE series_id = ${seriesId}`,
//     //     (err, rows) => {
//     //     if (err) {
//     //         res.status(500).send(err);
//     //     }
//     //     else if (rows) {
//     //         res.status(200).send({ issues: rows });
//     //     }
//     //     else if (!rows) {
//     //         res.status(404).send();
//     //     }
//     // });
// });

// //*I think I need to secure seriesId elsewhere, because it's not in the request body
// apiRouter.post('/series/:seriesId/issues', validateSeriesId, validateIssue, (req, res, next) => {
//     const newIssue = req.body.issue;
//     const seriesId = req.params.seriesId;
//     console.log(`>>>>>>>> ${pp(newIssue)}`);
//     // db.run(`INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $number, $date, $artistId, $seriesId)`, 
//     // {
//     //     $name: newIssue.name,
//     //     $number: newIssue.issueNumber,
//     //     $date: newIssue.publicationDate,
//     //     $artistId: newIssue.artistId,
//     //     $seriesId: seriesId
//     // },
//     // function (err) {
//     //     if (err) {
//     //         res.status(500).send();
//     //     }
//     //     else {
//     //         db.get(`SELECT * FROM Issue WHERE id = ${this.lastID}`, 
//     //         (err, row) => {
//     //             if (err) {
//     //                 res.status(500).send();
//     //             }
//     //             else {
//     //                 res.status(201).send({ issue: row });
//     //             }
//     //         });
//     //     }
//     // });
// });



module.exports = issuesRouter;