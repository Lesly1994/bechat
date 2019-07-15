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

    socket.on('username:update', username => {
      io.emit('username:updated', username);
      socket.username = username;
    });

    socket.on("message:create", message => {
      Message.create({ user: message.user, content: message.content }, (error, message) => {
        if (error) console.error(error);
        io.emit("message:created", message);
      });
    });

    socket.on("disconnect", () => {
      if (settings.debug) console.log("A user has been disconnected:", socket.id);
    });
  });
};
