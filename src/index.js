// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// configure and listen on port: 8080
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
let server = app.listen(8080, () => {
  console.log(`Server started at http://127.0.0.1:8080`);
});

// Require and create websocket server
let io = require("socket.io")(server);

// Connect to mongoDB
mongoose.connect(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@becode-shard-00-00-xb6ce.gcp.mongodb.net:27017,becode-shard-00-01-xb6ce.gcp.mongodb.net:27017,becode-shard-00-02-xb6ce.gcp.mongodb.net:27017/bechat?ssl=true&replicaSet=Becode-shard-0&authSource=admin&retryWrites=true&w=majority`, { useNewUrlParser: true });

// Require required files
require("./routes/application.js")(app);
require("./routes/websocket.js")(io);
