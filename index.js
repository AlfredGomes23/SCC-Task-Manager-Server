const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

//middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173',
        'https://cosmic-crisp-46ba03.netlify.app',
        'https://scc-task-manager.web.app',
        'https://scc-task-manager.firebaseapp.com']
}));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        //database collections
        const users = client.db("task-manager").collection("users");
        const tasks = client.db("task-manager").collection("tasks");

        //_____________________jwt_____________________
        app.get('/jwt', async (req, resp) => {

        });
        //get all_______________Users_________________
        app.get('/users', async (req, resp) => {
            const result = await users.find().toArray();
            resp.send(result);
        });
        //check if user
        app.get('/user', async (req, resp) => {
            const { email } = req.query;
            const result = await users.findOne({ email: email });
            resp.send(result ? { new: false } : { new: true })
        });
        //add a user
        app.post('/users', async (req, resp) => {
            const user = req.body;
            const result = await users.insertOne(user);
            resp.send(result);
        });
        //get an user's tasks
        app.get('/tasks', async (req, resp) => {
            const { email, task } = req.query;
            const today = new Date().toISOString().split("T")[0];
            let result = await tasks.find({
                "email": email,
                "status": task,
                "date": today
            }).sort({ "priority": 1 }).toArray();
            resp.send(result);
        });
        //add a task
        app.post('/task', async (req, resp) => {
            const task = req.body;
            const result = await tasks.insertOne(task);
            resp.send(result);
        });
        //update a task status
        app.patch('/task/:status/:id', async (req, resp) => {
            const { status, id } = req.params;
            const result = await tasks.updateOne({ _id: new ObjectId(id) },
                { $set: { "status": status } });
            console.log(status, id, result);
            resp.send(result);
        });
        //delete a task
        app.delete('/task/:id', async (req, resp) => {
            const { id } = req.params;
            const result = await tasks.deleteOne({ _id: new ObjectId(id) });
            console.log(id, result);
            resp.send(result);
        });
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




//home route
app.get('/', (req, resp) => {
    resp.send("Task Manager is Running.");
});
//terminal response
app.listen(port, () => {
    console.log('Server is live.');
});