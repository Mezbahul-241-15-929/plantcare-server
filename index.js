const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json());

app.use(cors())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb+srv://mezbahul:2A3NW9ZuLLtGXaGu@cluster0.1jlx3rd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


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

    //For Plant Care Website
    const plantCollection = client.db('plantDB').collection('coffees');


    //send plnat  data to the mongodb server
    app.post('/plants', async (req, res) => {
      const newplant = req.body;
      console.log(newplant);

      //add formdata into mongodb coffee server
      const result = await plantCollection.insertOne(newplant);
      res.send(result);
    })

    //get plants  data from mongodb server 
    app.get('/plants', async (req, res) => {
      // const cursor = coffeesCollection.find();
      // const result = await cursor.toArray();
      const result = await plantCollection.find().toArray();
      res.send(result);
    });

    app.get('/plants/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await plantCollection.findOne(query);
      res.send(result);
    });

    app.delete('/plants/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await plantCollection.deleteOne(query);
      res.send(result);

    })
  //change  data from the database
    app.put('/plants/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedPlant = req.body;
      const updatedDoc = {
        $set: updatedPlant

      }
      const result = await plantCollection.updateOne(filter, updatedDoc, options);

      res.send(result);

    })
    
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Plant Care Database')
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})