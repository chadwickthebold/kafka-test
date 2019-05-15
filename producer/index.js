const hapi = require('hapi');
const kafka = require('kafka-node');
const winston = require('winston');
const Transport = require('winston-transport');
const Joi = require('@hapi/joi');
const uuidv4 = require('uuid/v4');
const sqlite3 = require('sqlite3');
const path = require('path');

const {
  KAFKA_HOST = 'localhost:9092',
  LOG_LEVEL = 'info',
  NODE_PORT = 8888
} = process.env;

const KafkaClient = new kafka.KafkaClient({kafkaHost: KAFKA_HOST});

const dbFile = path.join(__dirname, '/../bookmarkDB');

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
      console.error('Error opening sqlite DB for bookmarks');
      process.exit();
    }

    console.log('Opened bookmarks db successfully');
});


process.on('SIGINT', function() {
    console.log('\nClosing db connection...');
    db.close();
    process.exit();
});

class KafkaTransport extends Transport {
  constructor(options) {
    super(options);

    this.client = KafkaClient;
    this.producer = new kafka.Producer(this.client);
  }


  // need to enforce message structure here
  log(info, callback) {

    const { eventKey, eventType, eventPayload } = info.message;
    const eventMessage = { key: eventKey, type: eventType, payload: eventPayload };

    const payload = {
      topic: 'users',
      messages: [JSON.stringify(eventMessage)],
      key: eventKey,
      timestamp: Date.now()
    };

    this.producer.send([payload], (err, data) => {
      if (err) {
        sysLogger.error('Failed to send event to Kafka', err);
      } else {
        this.emit('logged', info);
      }

      if (callback) {
        callback();
      }
    });
  }
};


const sysLogger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});

const eventLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new KafkaTransport()
  ]
});

// this feels unnecessary?
function triggerEvent(eventKey, eventType, eventPayload) {
  eventLogger.info({eventKey, eventType, eventPayload});
}


(async () => {
  const server = hapi.server({
    port: NODE_PORT,
    host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/ping',
    handler: (request, h) => {
      return 'pong';
    }
  });

  server.route({
    method: 'POST',
    path: '/authenticate',
    handler: (request, h) => {
      // generate a random uuid
      const randomUUID = uuidv4();
      
      triggerEvent(`amg::${randomUUID}`, 'user::authenticate');

      return h.response().code(200);
    },
    options: {
      validate: {
        payload: {
          email: Joi.string().email().required(),
          password: Joi.string().required()
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/users/{user}/bookmarks',
    handler: (request, h) => {
      triggerEvent(`amg::${request.params.user}`, 'BOOKMARK_ADD', {url: request.payload.url});
      return h.response.code(201);
    },
    options: {
      validate: {
        params: {
          user: Joi.string().guid().required()
        },
        payload: {
          url: Joi.string().uri({
            scheme: ['http', 'https']
          }).required()
        }
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/user/{user}/bookmarks',
    handler: (request, h) => {
      triggerEvent(`amg::${request.params.user}`, 'BOOKMARK_DELETE', {url: request.query.url});
      
      return h.response.code(200);
    },
    options: {
      validate: {
        params: {
          user: Joi.string().guid().required()
        },
        query: {
          url: Joi.string().uri({
            scheme: ['http', 'https']
          }).required()
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/bookmarks',
    handler: (request, h) => {
      
    }
  });

  await server.start();
  sysLogger.info(`Event producer running on ${server.info.uri}`);

})();

