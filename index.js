const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();

//middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173']
}));
//home route
app.get('/', (req, resp) => {
    resp.send("Task Manager is Running.");
});
//terminal response
app.listen(port, () => {
    console.log('Server is live.');
});