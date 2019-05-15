const kafka = require('kafka-node');
const sqlite3 = require('sqlite3');
const path = require('path');

const {
  KAFKA_HOST = 'localhost:9092',
  LOG_LEVEL = 'info'
} = process.env;

const dbFile = path.join(__dirname, '/../bookmarkDB');

const KafkaClient = new kafka.KafkaClient({kafkaHost: KAFKA_HOST});

const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('error opening sqlite DB for bookmarks');
    process.exit();
  }

  console.log('Opened bookmarks db successfully');
});


process.on('SIGINT', function() {
  console.log('\nClosing db connection...');
  db.close();
  process.exit();
});

