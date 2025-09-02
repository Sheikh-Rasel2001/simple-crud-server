const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Simple CRUD user is running')
});
// user : SimpleCRUD
// pass : m3A9cvLSUz4Tvujx

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://SimpleCRUD:m3A9cvLSUz4Tvujx@cluster0.syoqmax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run(){
   try{
    await client.connect();

    const dataBase = client.db('myDB');
    const userCollection = dataBase.collection('users');

    app.get('/users', async (req, res) => {
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result);
    })

    app.post('/users', async (req, res) => {
        console.log('create new users', req.body);
        const newUser = req.body;
        const result = await userCollection.insertOne(newUser);
        res.send(result);
    })
    
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateUser = req.body;
      const updateDoc = {
        $set: {
          name : updateUser.name,
          email: updateUser.email
        }
      }
      const options = {upsert: true};
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
      console.log(result);
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    await client.db("admin").command({ping : 1})
    console.log('you successfully connected to MongoDB')
   }
   finally{

   }
}


run().catch(console.dir);

app.listen(port, () => {
    console.log(`Simple CRUD is running on ${port}`)
});