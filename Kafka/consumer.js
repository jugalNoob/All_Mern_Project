const {}=require('./client')

const group=process.argv[2]

const init =async()=>{

    const consumer = kafka.consumer({ groupId: group })

    await consumer.connect()
await consumer.subscribe({ topic: groupId, fromBeginning: true })


await consumer.run({
    eachMessage: async ({ topic, partition, message  , heartbeat , pause}) => {
    
        console.log( `${group} [${topic}] ${partition}:`, message.value.toString())
    },
  })

}