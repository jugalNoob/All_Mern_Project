// const { Kafka } = require('kafkajs')
//  exports.kafka = new Kafka({
//   clientId: 'my-app', /// 

//   brokers: ['192.168.29.79:9092']
// })


const { Kafka } = require('kafkajs')
 exports.kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['listeners=PLAINTEXT://192.168.29.79:9092'],
  connectionTimeout: 3000, // Optional: Adjust the timeout as needed
});