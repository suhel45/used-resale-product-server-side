const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('node is running')
})
console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dwtnipt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const durantaCollections = client.db('Bi-cycle-stores').collection('duranta');
        const bookingsCollections = client.db('Bi-cycle-stores').collection('booking');
        app.get('/duranta',async(req,res)=>{
            const query = { }
            const result = await durantaCollections.find(query).toArray();
            res.send(result)
        })
        app.post('/bookings',async(req,res)=>{
            const booking = req.body;
            const result = await bookingsCollections.insertOne(booking);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(e=>console.log(e))


app.listen(port,()=>{
    console.log(`server is running at port:${port}`)
})