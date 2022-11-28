const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken')
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
        const usersCollections = client.db('Bi-cycle-stores').collection('users');
        const productsCollections = client.db('Bi-cycle-stores').collection('products');
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

        app.post('/users',async(req,res)=>{
            const user = req.body;
            const result = await usersCollections.insertOne(user);
            res.send(result);
            console.log(result)
        })

        app.get('/orders',async(req,res)=>{
            const email = req.query.email;
            const query={
                email:email
            }
            const order = await bookingsCollections.find(query).toArray();
            res.send(order);
        })

        app.get('/sellers',async(req,res)=>{
            const query = {
                role:'Seller'
            }
            const result = await usersCollections.find(query).toArray();
            res.send(result);
        })

        app.get('/buyers',async(req,res)=>{
            const query = {
                role:'User'
            }
            const result = await usersCollections.find(query).toArray();
            res.send(result);
        })

        app.post('/products',async(req,res)=>{
            const products = req.body;
            const result = await productsCollections.insertOne(products);
            res.send(result);
            console.log(result);
        })


        app.post('/jwt',(req,res)=>{
            const user = req.body;
            const token = jwt.sign(user,process.env.ACCESS_TOKEN,{expiresIn:'360d'})
            res.send({token})
        })
    }
    finally{

    }
}
run().catch(e=>console.log(e))


app.listen(port,()=>{
    console.log(`server is running at port:${port}`)
})