const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


//Creating "Artist" table
db.run("CREATE TABLE Artist (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, date_of_birth TEXT NOT NULL, biography TEXT NOT NULL, is_currently_employed INTEGER DEFAULT 1);");

//Creating "Series" table
db.run("CREATE TABLE Series (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL);");

//Creating "Issue" table
//! Tried establishing foreign keys according to sql documentation. Failed.
// db.run("CREATE TABLE Issue (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, issue_number TEXT NOT NULL, publication_date TEXT NOT NULL, artist_id INTEGER FOREIGN KEY REFERENCES Artist(id) NOT NULL, series_id INTEGER FOREIGN KEY REFERENCES Series(id) NOT NULL);");
//! Tried establishing foreign keys according to sqlite documentation. Failed.
// db.run("CREATE TABLE Issue (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, issue_number TEXT NOT NULL, publication_date TEXT NOT NULL, FOREIGN KEY(artist_id) REFERENCES Artist(id) NOT NULL, FOREIGN KEY(series_id) REFERENCES Series(id) NOT NULL);");
//!Needed to create table with names, and just remember they're foreign keys
db.run("CREATE TABLE Issue (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, issue_number TEXT NOT NULL, publication_date TEXT NOT NULL, artist_id INTEGER NOT NULL, series_id INTEGER NOT NULL);");