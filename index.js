const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dwtnipt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const  verifyJWT = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.send({message:'unauthorized access'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN,function(err,decoded){
        if(err){res.send({message:'unauthorized access'})}
        req.decoded=decoded;
        next();
    })
}

async function run(){
    try{
        const durantaCollections = client.db('Bi-cycle-stores').collection('duranta');
        const HeroCollections = client.db('Bi-cycle-stores').collection('Hero');
        const PhoenixCollections = client.db('Bi-cycle-stores').collection('Phoenix');
        const bookingsCollections = client.db('Bi-cycle-stores').collection('booking');
        const usersCollections = client.db('Bi-cycle-stores').collection('users');
        const productsCollections = client.db('Bi-cycle-stores').collection('products');
        app.get('/duranta',async(req,res)=>{
            const query = { }
            const result = await durantaCollections.find(query).toArray();
            res.send(result)
        })
        app.get('/Hero',async(req,res)=>{
            const query = { }
            const result = await HeroCollections.find(query).toArray();
            res.send(result)
        })
        app.get('/Phoenix',async(req,res)=>{
            const query = { }
            const result = await PhoenixCollections.find(query).toArray();
            res.send(result)
        })
        app.post('/bookings',async(req,res)=>{
            const booking = req.body;
            const result = await bookingsCollections.insertOne(booking);
            res.send(result);
        })
        app.get('/bookings/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {
                _id:ObjectId(id)
            }
            const booking = await bookingsCollections.findOne(query);
            res.send(booking);
        })

        app.post('/users',async(req,res)=>{
            const user = req.body;
            const result = await usersCollections.insertOne(user);
            res.send(result);
        })

        app.get('/orders', async(req,res)=>{
            const email = req.query.email;
            console.log(email);
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

        app.get('/admin',async(req,res)=>{
            const query = {
                admin:'Admin'
            }
            const admin = await usersCollections.find(query).toArray();
            res.send(admin);
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
        })

        app.get('/products',async(req,res)=>{
            const email = req.query.email;
            const query ={
                email:email
            }
            const product = await productsCollections.find(query).toArray();
            res.send(product);
        })

        app.post('/jwt',(req,res)=>{
            const usr = req.body;
            const token = jwt.sign(usr,process.env.ACCESS_TOKEN,{expiresIn:'1h'})
            res.send({token})
        })
        app.delete('/sellers/:id',verifyJWT,async(req,res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollections.deleteOne(filter);
            res.send(result);
        })
        app.delete('/buyers/:id',verifyJWT,async(req,res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollections.deleteOne(filter);
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