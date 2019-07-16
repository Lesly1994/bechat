const socket = io();
let message = document.getElementById("message"),
  target = document.getElementById("messages"),
  form = document.getElementById('message-form');

// We instanciate Firebase.
firebase.initializeApp({
  apiKey: "AIzaSyAzN1T3IG8e-0BAB228RPnmsaaqkre_8ag",
  databaseURL: "https://becode-joshua.firebaseio.com",
  authDomain: "becode-joshua.firebaseapp.com"
});


window.onload = () => {
  /**
   * Use these function to handle the authentication state change.
   */
  firebase.auth().onAuthStateChanged(user => {
    if (user) {

      // Request the message history.
      socket.emit("message:history");
      // Assign username to socket.
      socket.emit("username:update", (user.displayName != null) ? user.displayName : user.email);

      // Handle the message history event.
      socket.on('message:history', (messages) => {
        document.body.classList.remove("d-none"); // When history is received, removing the "d-none" from body.
        messages.forEach(message => {
          let entry = document.createElement('li');
          entry.innerHTML = `[${new Date(message.createdAt).toLocaleTimeString()}] ${message.user.username}: <i>${message.content}</i>`;
          
          // If the message user UID it's equal to my UID, the message is from me.
          if (message.user.uid === user.providerData[0].uid) {
            entry.classList.add('me');
          } else {
            entry.classList.add('him')
          }

          // Append entry to target.
          target.appendChild(entry);
        });

        window.scrollTo(0, 999999); // Used to scroll down the page when history message is created.
      });

      // Handle the message created event.
      socket.on('message:created', (message) => {
        let entry = document.createElement('li');
        entry.innerHTML = `[${new Date(message.createdAt).toLocaleTimeString()}] ${message.user.username}: <i>${message.content}</i>`;
        
        // If the message user UID it's equal to my UID, the message is from me.
        if (message.user.uid === user.providerData[0].uid) {
            entry.classList.add('me');
          } else {
            entry.classList.add('him')
          }

        // Append entry to target.
        target.appendChild(entry);

        // Used to scroll down smooth the page when a new message is created.
        window.scroll({
          top: document.body.scrollHeight * 9999, 
          behavior: 'smooth'
        });
      });

      // Handle the form submit event.
      form.addEventListener("submit", e => {
        e.preventDefault(); // Disable default behavior.

        // When submit is handle, we emit the "message:create" to socket server.
        socket.emit("message:create", {
          user: {
            uid: user.providerData[0].uid,
            username: (user.displayName != null) ? user.displayName : user.email,
            photo: user.photoURL
          },
          content: message.value
        });

        // When event is emitted, we clear the message input.
        message.value = null;
      });

    } else {
      firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider());
    }
  });
};