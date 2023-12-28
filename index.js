const express = require('express')
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express()
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("database connected"))
    .catch((err) => console.log(err));


app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(3000, () => {
    console.log("Server started");
})