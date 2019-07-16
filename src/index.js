// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Define global settings.
const settings = {
  debug: process.env.DEBUG || false,
  application: { port: process.env.PORT || 5000 },
  mongodb: { url: process.env.MONGODB || 'mongodb://localhost:27017/bechat' },
  websocket: {}
};

// Configure and listen on port: "settings.application.port"
app.set("views", __dirname + "/views"); // Set the view folder
app.set("view engine", "ejs"); // Make express view engine use EJS
app.use(express.static(__dirname + '/resources')); // It's used to serve static file from resources folder.
let server = app.listen(settings.application.port, () => {
  console.log(`Server started at http://127.0.0.1:${settings.application.port}`);
});

// Require and create websocket server
let io = require("socket.io")(server, settings.websocket);

// Connect to mongoDB
mongoose.connect(settings.mongodb.url, { useNewUrlParser: true });

// Load required files
require("./routes/application.js")(app);
require("./routes/websocket.js")(io, settings);
