const express=require('express')
const app=express()

const {kafka}=require('./client')


const init = async()=>{
    const admin=kafka.admin()
    console.log('admin connecting')

    admin.connect()

    console.log('admin successfully connected')


    console.log('createing Topic []')
  await  admin.createTopics({

        topics:[{
            topic:'rider-Update',
            numPartitions:2
        }]
    })

    console.log('Topic Create SucessFully [Rider-Update')

    console.log('Disconnting Toips []')
    await  admin.disconnect()
}
init()




app.get('/' , (req,res)=>{

    res.send("jugal sharma")
})

let port =process.env.PORT || 9000


try {
    if (port) {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } else {
        throw new Error('Invalid port number');
    }
} catch (error) {
    console.error(error.message);
}


// await producer.send({

//     topic: <String>,
//     messages: <Message[]>,
//     acks: <Number>,
//     timeout: <Number>,
//     compression: <CompressionTypes>,
// })




// await producer.send({
//     topic,
//     messages: [{
//       key: 'my-key',
//       value: JSON.stringify({ some: 'data' })
//     }]
//   })
  


//   const eachMessage = async ({ /*topic, partition,*/ message }) => {
//     // From Kafka's perspective, both key and value are just bytes
//     // so we need to parse them.
//     console.log({
//       key: message.key.toString(),
//       value: JSON.parse(message.value.toString())
//     })