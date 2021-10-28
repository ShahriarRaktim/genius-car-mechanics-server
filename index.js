const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId= require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0js5x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();

        const database = client.db('genius')
        const serviceCollection= database.collection('service');

        //Get All
        app.get('/services', async (req, res)=>{
            const result = await serviceCollection.find({}).toArray();
            res.send(result)
        })
        
        //Get One
        app.get('/services/:id', async (req, res)=>{
            const id = req.params.id;
            const service = {_id:ObjectId(id)};
            const result = await serviceCollection.findOne(service);
            console.log(result)
            res.send(result)
        })
        //Post
        app.post('/services', async (req, res)=>{
            const service= req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result)
        })

        //Delete
        app.delete('/services/:id', async (req, res)=>{
            const id = req.params.id;
            const service = {_id:ObjectId(id)}
            const result= await serviceCollection.deleteOne(service)
            res.send(result)
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Running Genius Server')
});

app.listen(port, ()=>{
    console.log("Running Genius Server on port",port)
})