const express = require('express');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, get, update } = require('firebase/database');
const app = express();
const cors = require('cors');

const firebaseConfig = {
    apiKey: "AIzaSyBHL4Bz-e1sBlSmZMi_2rcQf04ACfWxRko",
    authDomain: "capstone-badbank-dfd1f.firebaseapp.com",
    databaseURL: "https://capstone-badbank-dfd1f-default-rtdb.firebaseio.com",
    projectId: "capstone-badbank-dfd1f",
    storageBucket: "capstone-badbank-dfd1f.appspot.com",
    messagingSenderId: "457999178063",
    appId: "1:457999178063:web:2ae0bf5d495e908400cd3a"
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
