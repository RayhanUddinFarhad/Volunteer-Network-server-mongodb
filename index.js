const express = require('express');
const cors = require('cors');
const app = express();
const event = require('./event.json')
const port = process.env.PORT || 7000;
const { MongoClient, ServerApiVersion } = require('mongodb');

require("dotenv").config();


app.use(express.json())
app.use(cors())







const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.edrit7p.mongodb.net/?retryWrites=true&w=majority`;









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




        const database = client.db("volunteer");
        const events = database.collection("events");

        app.get('/allEvents', async(req, res) => {




            const page = parseInt(req.query.page) || 1; // Current page number, defaulting to 1 if not provided
            const limit = parseInt(req.query.limit) || 10; // Number of items per page, defaulting to 10 if not provided
          
            // Calculate the skip value to determine the starting index of the items to fetch
            const skip = (page) * limit;

            const cursor =  events.find()
            const result = await cursor.skip(skip).limit(limit).toArray();

            res.send(result)




        })


        app.get ('/eventsAll', async (req, res) => { 



            const result = await events.find().toArray();

            res.send (result)
        })


        app.get ('/eventbyDate', async (req, res) => { 




            const result = await events.find().sort( {date : -1 }).toArray();
            res.send (result)
        })

        app.post ('/allEvents', async(req, res) => { 

            const body = req.body;


            const query =  {


                image : body.image,
                name  : body.name,
                description : body.Description,
                colorCode : body.colorCode,
                date : body.date

            }

            const result = await events.insertOne (query)

            res.send (result)




        })





        app.get ('/totalItems', async (req, res) => {




            const result = await events.estimatedDocumentCount();

            res.send ({ totalProducts: result})






        })






        const volunteers = database.collection('registered')



        app.get ('/volunteers', async(req, res) => { 



            const cursor = volunteers.find ()
            const result = await cursor.toArray ()

            res.send (result)
        })



        app.post ('/volunteers', async(req, res) => { 


            const body = req.body

            const query = {

                name : body.name,
                userName : body.username,
                date : body.date,
                description : body.description,
                events : body.events

            }



            const result = await volunteers.insertOne (query)

            res.send (result)
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





app.get('/events', (req, res) => {



    res.send(event)
})


app.get('/', (req, res) => {

    res.send("I am volunteer")
})

app.listen(port, () => {


    console.log(port);
})
