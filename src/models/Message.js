const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Message",
  new mongoose.Schema(
    {
      username: String,
      message: String
    },
    { versionKey: false }
  )
);
