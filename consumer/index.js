const kafka = require('kafka-node');
const sqlite3 = require('sqlite3');
const path = require('path');

const {
  KAFKA_HOST = 'localhost:9092',
  LOG_LEVEL = 'info'
} = process.env;

const dbFile = path.join(__dirname, '/../bookmarkDB');

let client;
let consumer;
let db;

async function connectToDb() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbFile, (err) => {
      if (err) {
        console.error('Error opening sqlite DB for bookmarks', err);
        reject(err);
      }

      console.log('Opened bookmarks DB successfully');
      resolve();
    });
  });
}

async function connectToKafka() {
  client = new kafka.KafkaClient({kafkaHost: KAFKA_HOST});
  consumer = new kafka.Consumer(client, [{topic: 'users'}], {autoCommit: false});


  consumer.on('message', function (message) {
    console.log('got message from topic!', message);
  });

  console.log('listening for topic messages...');
}

process.on('SIGINT', function() {
  console.log('\nClosing db connection...');
  db.close();
  process.exit();
});

(async () => {
  await connectToDb();
  await connectToKafka();
})();

