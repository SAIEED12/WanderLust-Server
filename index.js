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
    const destinationCollection = db.collection("destinations") //creating collections
    const bookingCollection = db.collection("bookings") //creating collectionss

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


//Edit modal API
    app.patch('/destinations/:id', async(req, res) =>{
      const {id} = req.params
      const updatedData = req.body

      const result = destinationCollection.updateOne(
        {_id: new ObjectId(id)}, //Specific element
        {$set: updatedData}
      )

      res.json(result)
    })

    
//Delete API
    app.delete('/destinations/:id', async(req, res) =>{
      const {id} = req.params
      const result = await destinationCollection.deleteOne({_id: new ObjectId(id)})
      res.json(result)
    })

//My Bookings Page

 app.get('/booking/:userId', async (req, res) => {
  const { userId } = req.params;
  const result = await bookingCollection.find({ userId: userId }).toArray(); 
  res.json(result);
});


//Booking Card Button
    app.post('/booking', async(req, res) =>{
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData)
      res.json(result)
    })


//Booking Cancel API
    app.delete('/booking/:bookingId', async(req, res)=>{
      const {bookingId} = req.params
      const result = await bookingCollection.deleteOne({_id: new ObjectId(bookingId)})
      res.json(result)
    })

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