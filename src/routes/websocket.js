const User = require("../models/User");
const Message = require("../models/Message");

module.exports = (io, settings) => {
  io.on("connect", socket => {
    if (settings.debug) console.log("A user has been connected:", socket.id);

    socket.on("message:history", () => {
      Message.find()
        .limit(100)
        .then(messages => {
          socket.emit("message:history", messages);
        });
    });

    socket.on("message:create", event => {
      Message.create({ username: event.username, message: event.message }, (error, message) => {
        if (error) console.error(error);
        io.emit("message:created", {
          username: event.username,
          message: event.message,
          created: new Date()
        });
      });
    });

    socket.on("disconnect", () => {
      if (settings.debug) console.log("A user has been disconnected:", socket.id);
    });
  });
};
