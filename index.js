const express = require('express');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, get, update } = require('firebase/database');
const app = express();
const cors = require('cors');
const dal = require("./dal");

const firebaseConfig = {
  apiKey: "AIzaSyAtqpcqqfcQB-njQq7Pmb7XGOfrjmJkblU",
  authDomain: "capstone-badbank-firebase.firebaseapp.com",
  databaseURL: "https://capstone-badbank-firebase-default-rtdb.firebaseio.com",
  projectId: "capstone-badbank-firebase",
  storageBucket: "capstone-badbank-firebase.appspot.com",
  messagingSenderId: "901970657534",
  appId: "1:901970657534:web:01c01b54fde411e15d25af"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Serve static files from the public directory
app.use(express.static('public'));
app.use(cors());

// Create user account
app.get('/account/create/:name/:email/:password', (req, res) => {
  const { name, email, password } = req.params;
  const usersRef = ref(database, 'users');
  const newUserRef = push(usersRef);
  update(newUserRef, { name, email, password })
    .then(() => {
      const userId = newUserRef.key;
      const user = { id: userId, name, email, password };
      console.log(user);
      res.send(user);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

// Login user
app.get('/account/login/:email/:password', (req, res) => {
  const { email, password } = req.params;
  res.send({ email, password });
});

// All accounts
app.get('/account/all', (req, res) => {
  const usersRef = ref(database, 'users');
  get(usersRef)
    .then(dataSnapshot => {
      const users = [];
      dataSnapshot.forEach(childSnapshot => {
        const userId = childSnapshot.key;
        const user = { id: userId, ...childSnapshot.val() };
        users.push(user);
      });
      console.log(users);
      res.send(users);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
