const express = require('express');
const cors = require('cors');
const customer = require('./customer.json');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        client.connect();

        const database = client.db("zooLandDB");
        const galleryCollection = database.collection("gallery");
        const allToysCollection = database.collection("allToys");

        app.get('/gallery', async (req, res) => {
            const result = await galleryCollection.find().toArray();
            console.log("goto gallery");
            res.send(result);
        })
        app.get('/allToys', async (req, res) => {
        let query = {};
        // const sortReq = parseInt(req.query.sort);
        // console.log(typeof(sortReq));
           if (req.query?.sellerEmail) {
                query = {
                    sellerEmail: req.query.sellerEmail,
                }
            }
            // const options = {
            //     sort: { "price": sortReq },

            // };
        //    const cursor = allToysCollection.find(query, options).limit(20);
           const cursor = allToysCollection.find(query).limit(20);

            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/alltoy/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await allToysCollection.findOne(query);
            console.log("Find Toy ", id);
            res.send(result);
        })

        app.post('/allToys', async (req, res) => {
            const toy = req.body;
            console.log(toy);
            const result = await allToysCollection.insertOne(toy);
            res.send(result);
        })



        app.put('/alltoy/:id', async (req, res) => {
            const id = req.params.id;
            const updatedToy = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    picture: updatedToy.picture,
                    price: updatedToy.price,
                    availableQuantity: updatedToy.availableQuantity,
                    rating: updatedToy.rating,
                    detailDescription: updatedToy.detailDescription
                },
            };
            const result = await allToysCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.delete('/alltoy/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await allToysCollection.deleteOne(query);
            console.log("delete Toy ", id);
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

app.get('/customer', (req, res) => {
    res.send(customer);
})



app.get('/', (req, res) => {
    res.send("Zoo Land is coming...");
})

app.listen(port, () => {
    console.log(`Zoo Lands port is ${port}`);
})