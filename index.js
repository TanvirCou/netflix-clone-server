const express = require('express')
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userHandler = require("./routeHandler/userHandler");
const authHandler = require("./routeHandler/authHandler");
const movieHandler = require("./routeHandler/movieHandler");
const listHandler = require("./routeHandler/listHandle");

const app = express()
app.use(express.json());
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("database connected"))
    .catch((err) => console.log(err));


app.get('/', (req, res) => {
  res.send('hello world')
});

app.use("/api/auth", authHandler);
app.use("/api/user", userHandler);
app.use("/api/movie", movieHandler);
app.use("/api/list", listHandler);

app.listen(3000, () => {
    console.log("Server started");
})