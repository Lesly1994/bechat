const Message = require("../models/Message");

module.exports = (io, settings) => {
  // Handle the "connect" event
  io.on("connect", socket => {
    if (settings.debug) console.log("A user has been connected:", socket.id);

    // Handle "message:history" event
    socket.on("message:history", () => {
      // Search for the last 100 messages in database
      Message.find()
        .limit(100)
        .then(messages => {
          socket.emit("message:history", messages); // Emit the "message:history" event with messages
        });
    });

    // Handle "username:update" event
    socket.on('username:update', username => {
      io.emit('username:updated', username); // Emit "username:updated" event with the username
      socket.username = username; // Set current socket username
    });

    // Handle "message:create" event
    socket.on("message:create", message => {
      // Create a message in database
      Message.create({ user: message.user, content: message.content }, (error, message) => {
        if (error) console.error(error);
        io.emit("message:created", message); // Emit "message:created" event with the message created
      });
    });

    // Handle "disconnect" event
    socket.on("disconnect", () => {
      if (settings.debug) console.log("A user has been disconnected:", socket.id);
    });
  });
};
