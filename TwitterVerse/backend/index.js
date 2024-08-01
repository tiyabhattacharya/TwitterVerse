const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://twitter_admin:FBW5GI1btpKYMNna@cluster0.x9frpzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongoDB() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.TRANS_HOST,
  port: process.env.TRANS_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.TRANS_USER,
    pass: process.env.TRANS_PASS,
  },
});

// Route to send OTP
app.post('/send-otp', (req, res) => {
  const { email, oneTime } = req.body;
  
  const mailOptions = {
    from: process.env.TRANS_USER,
    to: email,
    subject: "Account Verification",
    text: `Your OTP code is ${oneTime}`,
    html: `<p>Your OTP code is <strong>${oneTime}</strong></p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending OTP');
    }
    console.log('Email sent:', info.response);
    res.status(200).send({ message: 'OTP sent', otp }); // Send OTP for testing; remove in production
  });
});

// Connect to MongoDB before starting the server
connectToMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });
});

async function run() {
    try {
        await client.connect();
        const postCollection = client.db("database").collection("posts"); // this collection is for team-ekt
        const userCollection = client.db("database").collection("users"); // this collection is for team-srv

        // get
        app.get('/user', async (req, res) => {
            const user = await userCollection.find().toArray();
            res.send(user);
        })
        app.get('/loggedInUser', async (req, res) => {
          const email = req.query.email;
            const user = await userCollection.find({ email: email }).toArray();
            res.send(user);
        })
        app.get('/post', async (req, res) => {
            const post = (await postCollection.find().toArray()).reverse();
            res.send(post);
        })
        app.get('/userPost', async (req, res) => {
            const email = req.query.email;
            const post = (await postCollection.find({ email: email }).toArray()).reverse();
            res.send(post);
        })

        // post
        app.post('/register', async (req, res) => {
          const user = req.body;
          const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        })

        
        // patch
app.patch('/userUpdates/:email', async (req, res) => {
  // const filter = {email:req.body.email};
  const filter =req.params;
  const profile = req.body;
  const options = { upsert: true };
  const updateDoc = { $set: profile };
  const result = await userCollection.updateOne(filter, updateDoc, options);
  res.send(result);
});



    } catch (error) {
        console.log(error);
    }
} run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello from twitter!')
});

