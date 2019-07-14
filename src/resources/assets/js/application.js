const socket = io();
let message = document.getElementById("message"),
  target = document.getElementById("messages"),
  form = document.getElementById('message-form');

firebase.initializeApp({
  apiKey: "AIzaSyDlRsOtf_KW9lrQi-I6uCMT5O8XTD4AUmc",
  databaseURL: "https://sandbox-af137.firebaseio.com",
  authDomain: "sandbox-af137.firebaseapp.com"
});

window.onload = () => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {

      socket.emit("message:history");
      socket.emit("username:update", user.displayName);

      socket.on("username:updated", (username) => {});
      socket.on('message:history', (messages) => {
        document.body.classList.remove("d-none");
        messages.forEach(message => {
          let entry = document.createElement('li');
          entry.innerHTML = `[${new Date(message.createdAt).toLocaleTimeString()}] ${message.username}: <i>${message.content}</i>`;
          target.appendChild(entry);

          window.scrollTo(0, document.body.scrollHeight);
        });
      });

      socket.on('message:created', (message) => {
        let entry = document.createElement('li');
        entry.innerHTML = `[${new Date(message.createdAt).toLocaleTimeString()}] ${message.username}: <i>${message.content}</i>`;
        target.appendChild(entry);

        window.scroll({
          top: document.body.scrollHeight, 
          behavior: 'smooth'
        });
      });

      form.addEventListener("submit", e => {
        e.preventDefault();
        socket.emit("message:create", {
          username: user.displayName,
          content: message.value
        });

        message.value = null;
      });

    } else {
      firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider());
    }
  });
};


// socket.on("message:created", event => {
//   let li = document.createElement("li");
//   li.innerHTML = event.username + ": " + event.message + " " + event.created;
//   li.classList.add("him");
//   container.appendChild(li);
//   window.scrollTo(0, document.querySelector("html").scrollHeight);
// });
