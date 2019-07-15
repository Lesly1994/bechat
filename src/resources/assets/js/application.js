const socket = io('https://be-chat.herokuapp.com');
let message = document.getElementById("message"),
  target = document.getElementById("messages"),
  form = document.getElementById('message-form');

firebase.initializeApp({
  apiKey: "AIzaSyAzN1T3IG8e-0BAB228RPnmsaaqkre_8ag",
  databaseURL: "https://becode-joshua.firebaseio.com",
  authDomain: "becode-joshua.firebaseapp.com"
});

window.onload = () => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {

      socket.emit("message:history");
      socket.emit("username:update", (user.displayName != null) ? user.displayName : user.email);

      socket.on("username:updated", (username) => {});
      socket.on('message:history', (messages) => {
        document.body.classList.remove("d-none");
        messages.forEach(message => {
          let entry = document.createElement('li');
          entry.innerHTML = `[${new Date(message.createdAt).toLocaleTimeString()}] ${message.user.username}: <i>${message.content}</i>`;
          
          if (message.user.username === user.displayName || message.user.username === user.email) {
            entry.classList.add('me');
          } else {
            entry.classList.add('him')
          }

          target.appendChild(entry);
        });
        window.scrollTo(0, 999999);
      });

      socket.on('message:created', (message) => {
        let entry = document.createElement('li');
        entry.innerHTML = `[${new Date(message.createdAt).toLocaleTimeString()}] ${message.user.username}: <i>${message.content}</i>`;
        
        if (message.user.username === user.displayName || message.username === user.email) {
            entry.classList.add('me');
          } else {
            entry.classList.add('him')
          }

        target.appendChild(entry);
        window.scroll({
          top: document.body.scrollHeight * 9999, 
          behavior: 'smooth'
        });
      });

      form.addEventListener("submit", e => {
        e.preventDefault();
        socket.emit("message:create", {
          user: {
            username: (user.displayName != null) ? user.displayName : user.email,
            photo: user.photoURL
          },
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
