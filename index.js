const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEYS}@cluster0.gvng5am.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("zooLandDB");
        const galleryCollection = database.collection("gallery");
        const allToysCollection = database.collection("allToys");

        app.get('/gallery', async (req, res) => {
            const result = await galleryCollection.find().toArray();
            console.log("goto gallery");
            res.send(result);
        })
        app.get('/allToys', async (req, res) => {
            const result = await allToysCollection.find().toArray();
            console.log("Find All Toys ");
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("Zoo Land is coming...");
})

app.listen(port, () => {
    console.log(`Zoo Lands port is ${port}`);
})