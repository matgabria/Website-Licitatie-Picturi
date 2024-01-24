const express = require('express');
const bcrypt = require('bcrypt');
//require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://matgabria:Jurassic98765@webproject.3am9dml.mongodb.net/?retryWrites=true&w=majority";
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const usersCollection = client.db("userLogin").collection("loginForm");

  try {
    const user = await usersCollection.findOne({ username: username });
    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
