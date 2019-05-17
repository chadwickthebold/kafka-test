# Kafka Test

Toy application for emiting and consuming events in Apache Kafka

## Local Requirements
* Kafka broker running at localhost:9092 with a `users` topic
* An sqlite DB file named bookmarksDB in the root dir of the project. Run `node bootstrapDB.js` to set-up/reset file to initial state.

## Getting Started

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
curl -X GET https://localhost:8888/users/5f031395-4ee6-4dbb-8291-1b0f0b40288a/bookmarks
```

