const express = require('express');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, get, update } = require('firebase/database');
const functions = require('firebase-functions');
const cors = require('cors');
const { create, find, findOne, updateBalance } = require("./dal");

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

const app = express();

// Serve static files from the public directory
app.use(express.static('public'));
app.use(cors());

// Create user account
app.get('/account/create/:name/:email/:password', (req, res) => {
  const { name, email, password } = req.params;
  create(name, email, password)
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

// // Login user
// app.get('/account/login/:email/:password', (req, res) => {
//   const { email, password } = req.params;
//   findOne(email)
//     .then((user) => {
//       if (user && user.password === password) {
//         res.send(user);
//       } else {
//         res.sendStatus(401);
//       }
//     })
//     .catch(error => {
//       console.error(error);
//       res.sendStatus(500);
//     });
// });

// All accounts
app.get('/account/all', (req, res) => {
  find()
    .then((users) => {
      console.log(users);
      res.send(users);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

// Update balance
app.get('/account/update/:email/:amount', (req, res) => {
  const { email, amount } = req.params;
  updateBalance(email, Number(amount))
    .then(() => {
      res.sendStatus(200);
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

module.exports = function(api, options) {
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "current"
          }
        }
      ]
    ],
    plugins: [
      "@babel/plugin-transform-arrow-functions"
    ]
  };
};