const User = require("../models/User");
const Message = require("../models/Message");

module.exports = io => {
  io.on("connect", socket => {
    console.log("A user has been connected");

    // Send all messages to front
    socket.on("request:message:all", () => {
      Message.find()
        .limit(100)
        .then(messages => {
          socket.emit("respond:message:all", messages);
        });
    });

    socket.on("message", event => {
      Message.create({ username: event.username, message: event.message }, (error, message) => {
        if (error) console.error(error);
        io.emit("broadcast:message", {
          username: event.username,
          message: event.message,
          created: new Date()
        });
      });
    });

    // socket.on("username:update", event => {
    //   socket.username = event.username;
    // });

    // socket.on("typing", event => {
    //   io.emit("broadcast:typing", {
    //     username: socket.username
    //   });
    // });

    socket.on("disconnect", () => {
      console.log("A user has been disconnected");
    });
  });
};
