const sqlite3 = require('sqlite3');
const path = require('path');

const DB_LOCATION = path.join(__dirname, 'bookmarkDB');

const db = new sqlite3.Database(DB_LOCATION, (err) => {
  if (err) {
    console.error('Error opening DB connection.');
    process.exit();
  }

  console.log('DB connection opened.');


  


  db.close();
  console.log('DB connection closed. Goodbye!');

});

