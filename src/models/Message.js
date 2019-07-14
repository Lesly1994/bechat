const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Message",
  new mongoose.Schema(
    {
      username: String,
      content: String
    },
    { versionKey: false, timestamps: true }
  )
);
