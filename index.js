const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

// DB user: productManagementUser1
// DB Pass: zCOlUXALhpia7wSe

const app = express();

// use middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.m12jl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {

        await client.connect();

        const productCollection = client.db("product-management").collection("product");

        //get all products
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            console.log("Getting products");
            res.send(products);
        });

        //create a product
        app.post('/add', async (req, res) => {
            const newProduct = req.body;
            console.log("Adding new Product", newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });


        //delete a product
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            console.log("Deletig id:", id);

            const result = await productCollection.deleteOne(query);
            console.log(result);
            res.send(result);

        })


    }
    finally {
        // client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running Node Server");
})

app.listen(port, () => {
    console.log("CRUD Server is running");
})