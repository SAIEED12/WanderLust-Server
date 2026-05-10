const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()

const uri = process.env.MONGODB_URI;

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    await client.connect();

// Creating API 
    const db = client.db("wanderlust") //creating database
    const destinationCollection = db.collection("destinations") //creating collectionss

    app.get('/destinations', async(req, res) =>{
      const result = await destinationCollection.find().toArray()
      res.json(result)
    });
    
    app.post('/destination', async(req, res) =>{
        const destinationData = req.body
        console.log(destinationData)
        const result = await destinationCollection.insertOne(destinationData)

        res.json(result)
    })
// End of creating API 


// Single Destination API
    app.get('/destinations/:id', async(req, res) => {
      const {id} = req.params
      const result = await destinationCollection.findOne({_id: new ObjectId(id)}) //converting string id to Object id
      res.json(result)
    })
// End of Single Destination API


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send("Server is running fine!")
})

app.listen(PORT, () =>{
    console.log(`Server running on ${PORT}`)
})