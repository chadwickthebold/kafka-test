# Kafka Test

Toy application for emiting and consuming events in Apache Kafka

## Local Requirements
* Kafka broker running at localhost:9092 with a `users` topic
* An sqlite DB file named bookmarksDB in the root dir of the project. Run `node bootstrapDB.js` to set-up/reset file to initial state.

## Getting Started

1. Follow the instructions in the [Apache Kafka quickstart guide](https://kafka.apache.org/quickstart) to install Kafka locally.
You'll need a utility script it provides to create the `users` topic.
2. Follow step 1 in the [Confluent docker quickstart guide](https://docs.confluent.io/current/quickstart/ce-docker-quickstart.html#ce-docker-quickstart)
to get a local set of docker components up and running. We really just need the broker but it provides a bunch of stuff if you want
to mess around some more. Protip - once you've run `docker-compose up -d --build` once you can start and stop the docker components
from the same directory with `docker-compose up` and `docker-compose down`.
3. From the kafka bin directory (step 1) run `bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic users`
4. Run `nvm use && npm install` in the root project directory. Run `node bootstrapDB.js` to initialize the bookmarks DB.
5. In separate tabs, run `npm install && node index.js` in the `consumer` and `producer` directories.
6. Run the set of sample `curl` commands listed below to demonstrate the event sourcing architecture

That's it! Keep reading through the Apache quickstart guide as it provides some handy tools, like producing/consuming events directly
from the command line, which can be helpful during debugging.

You can connect to bookmarksDB with a local sqlite3 client with `sqlite3 bookmarksDB`. `SELECT * FROM bookmarks;` will display
all the aggregated user bookmark records.


## References

* Confluent Kafka Docker Quickstart: https://docs.confluent.io/current/quickstart/ce-docker-quickstart.html#ce-docker-quickstart
* Apache Kafka Quickstart: https://kafka.apache.org/quickstart
* kafka-node https://github.com/SOHU-Co/kafka-node
* winston https://github.com/winstonjs/winston
* winston-transport https://github.com/winstonjs/winston-transport
* protobufjs https://github.com/protobufjs/protobuf.js

## Sample `curl` calls

### Authenticate
```
curl -d '{"email":"info@tylerchadwick.com", "password":"test123"}' -H "Content-Type: application/json" -X POST http://localhost:8888/authenticate
```

### Add bookmark
```
curl -d '{"url": "https://www.newyorker.com/news/our-columnists/more-questions-than-answers-about-boeing-the-737-max-and-the-faa"}' -H "Content-Type: application/json" -X POST http://localhost:8888/users/5f031395-4ee6-4dbb-8291-1b0f0b40288a/bookmarks
```

### Delete bookmark
```
curl -X DELETE http://localhost:8888/users/5f031395-4ee6-4dbb-8291-1b0f0b40288a/bookmarks?url=https%3A%2F%2Fwww.newyorker.com%2Fnews%2Four-columnists%2Fmore-questions-than-answers-about-boeing-the-737-max-and-the-faa
```

### Get bookmarks
```
curl -X GET http://localhost:8888/users/5f031395-4ee6-4dbb-8291-1b0f0b40288a/bookmarks
```

