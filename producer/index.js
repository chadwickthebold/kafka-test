const hapi = require('hapi');
const kafka = require('kafka-node');
const winston = require('winston');
const Transport = require('winston-transport');

const {
  KAFKA_HOST = 'localhost:9092',
  LOG_LEVEL = 'info',
  NODE_PORT = 8888
} = process.env;


class KafkaTransport extends Transport {
  constructor(options) {
    super(options);

    const kafkaClient = new kafka.KafkaClient({kafkaHost: KAFKA_HOST});
    const kafkaProducer = new kafka.Producer(kafkaClient);
  }

  log(info, callback) {

    callback();
  }
};


// All event logs will be of severity 'info'
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

    }
  });

  server.route({
    method: 'POST',
    path: '/bookmarks',
    handler: (request, h) => {
    
    }
  });

  server.route({
    method: 'DELETE',
    path: '/bookmarks,
    handler: (request, h) => {

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

