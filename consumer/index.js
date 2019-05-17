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

const uuidRegexp = new RegExp('amg::([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})');


function addBookmark(key, payload, timestamp) {
  console.log(`Adding bookmark for key: ${key}`);
  let uuid = key.match(uuidRegexp);
  uuid = uuid[1]; // take the 1st capture group

  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO bookmarks (url, user, createdAt) VALUES ('${payload.url}', '${uuid}', '${timestamp}')`, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

function deleteBookmark(key, payload) {

}

const ACTION_MAP = {
  BOOKMARK_ADD: addBookmark,
  BOOKMARK_DELETE: deleteBookmark
};

async function connectToKafka() {
  client = new kafka.KafkaClient({kafkaHost: KAFKA_HOST});
  consumer = new kafka.Consumer(client, [{topic: 'users'}], {autoCommit: false});

  // value: {key, type, payload}
  consumer.on('message', async function (message) {
    // parse message value
    const parsedMessage = JSON.parse(message.value);
    const actionFunction = ACTION_MAP[parsedMessage.type];
    console.log('got message from topic!', message);
 
    if (actionFunction) {
      await actionFunction(message.key, parsedMessage.payload, parsedMessage.timestamp);
    }
  });

  console.log('listening for topic messages...');
}

process.on('SIGINT', function() {
  console.log('\nClosing db connection...');
  db.close();

  console.log('\nComitting kafka consumer offset...');
  consumer.commit();
  process.exit();
});

(async () => {
  await connectToDb();
  await connectToKafka();
})();

