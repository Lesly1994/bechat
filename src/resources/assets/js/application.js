(() => {
  let username = prompt("Please type your username");
  const socket = io.connect();
  let message = document.getElementById("message"),
    container = document.getElementById("messages"),
    send = document.getElementById("send");

  // Request all messages
  socket.emit("message:history");
  socket.on("message:history", event => {
    console.log(event);
  });

  // Handling send clicking
  send.addEventListener("click", e => {
    e.preventDefault();
    socket.emit("message:create", {
      username,
      message: message.value
    });
    message.value = null;
  });

  socket.on("message:created", event => {
    let li = document.createElement("li");
    li.innerHTML = event.username + ": " + event.message + " " + event.created;
    li.classList.add("him");
    container.appendChild(li);
    window.scrollTo(0, document.querySelector("html").scrollHeight);
  });
})();
