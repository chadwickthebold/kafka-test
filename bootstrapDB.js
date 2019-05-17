const sqlite3 = require('sqlite3');
const path = require('path');

const DB_LOCATION = path.join(__dirname, 'bookmarkDB');

// Create a bookmark table with the follow columns
// id
// url
// user

const db = new sqlite3.Database(DB_LOCATION, (err) => {
  if (err) {
    console.error('Error opening DB connection.');
    process.exit();
  }

  console.log('DB connection opened.');


  // drop old table, if one exists
  db.run('DROP TABLE IF EXISTS bookmarks;', () => {
    console.log('Dropped old bookmarks table');
     // create bookmarks table
    db.run('CREATE TABLE bookmarks(id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL, user TEXT NOT NULL, createdAt TEXT NOT NULL, UNIQUE(url, user));', () => {
      console.log('Created new table "bookmarks"');
      db.close();
      console.log('DB connection closed. Goodbye!');
    });
  });
});

