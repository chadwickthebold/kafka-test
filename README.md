# Kafka Test

Toy application for emiting and consuming events in Apache Kafka

## Local Requirements
* Kafka broker running at localhost:9092 with a `users` topic
* An sqlite DB file named bookmarksDB in the root dir of the project. Run `node bootstrapDB.js` to set-up/reset file to initial state.

## References

* Confluent Kafka Docker Quickstart: https://docs.confluent.io/current/quickstart/ce-docker-quickstart.html#ce-docker-quickstart
* Apache Kafka Quickstart: https://kafka.apache.org/quickstart
* kafka-node https://github.com/SOHU-Co/kafka-node
* winston https://github.com/winstonjs/winston
* winston-transport https://github.com/winstonjs/winston-transport
* protobufjs https://github.com/protobufjs/protobuf.js

