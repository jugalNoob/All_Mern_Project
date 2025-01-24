const {kafka}=require('./client')

const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


const init =()=>{
    const producer = kafka.producer()
    const run = async () => {
        await producer.connect()

        rl.setPrompt('>')

        rl.prompt()

        rl.on('line', async (line) => {

            const [riderName , loaction]=line.split(' ')
        
            await producer.send({
                topic: 'rider-Update',
                messages: [
                    { 
                        partition:location.toLowerCase() === 'north' ? 0 : 1,
                        key: 'location-update' , value:JSON.stringify({name:riderName , loc:loaction}) },
                ],
            })
        }).on('close' , async()=>{   await producer.disconnect()})
       
     
    }
    run().catch(console.error)
}
init()