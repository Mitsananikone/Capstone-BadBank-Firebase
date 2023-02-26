var firebase = require('firebase/database');
var getDatabase = firebase.getDatabase;
var ref = firebase.ref;
var push = firebase.push;
var get = firebase.get;
var update = firebase.update;
var firebase = require('firebase/app');

const firebaseConfig = {
  apiKey: "AIzaSyAtqpcqqfcQB-njQq7Pmb7XGOfrjmJkblU",
  authDomain: "capstone-badbank-firebase.firebaseapp.com",
  databaseURL: "https://capstone-badbank-firebase-default-rtdb.firebaseio.com",
  projectId: "capstone-badbank-firebase",
  storageBucket: "capstone-badbank-firebase.appspot.com",
  messagingSenderId: "901970657534",
  appId: "1:901970657534:web:01c01b54fde411e15d25af"
};

// Initialize Firebase using the configuration object
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database
const db = getDatabase();

// create user account
function create(name, email, password) {
  return new Promise((resolve, reject) => {
    const usersRef = ref(db, 'users');
    const newPostRef = push(usersRef);
    const doc = {
      name,
      email,
      password,
      balance: 0
    };
    update(newPostRef, doc)
      .then(() => resolve(doc))
      .catch((err) => reject(err));
  });
}

// find user account
function find(email) {
  return new Promise((resolve, reject) => {
    const usersRef = ref(db, 'users');
    get(usersRef)
      .then((snapshot) => {
        const users = snapshot.val();
        const result = [];
        for (const userKey in users) {
          if (users[userKey].email === email) {
            result.push(users[userKey]);
          }
        }
        resolve(result);
      })
      .catch((err) => reject(err));
  });
}

// find user account
function findOne(email) {
  return new Promise((resolve, reject) => {
    const usersRef = ref(db, 'users');
    get(usersRef)
      .then((snapshot) => {
        const users = snapshot.val();
        for (const userKey in users) {
          if (users[userKey].email === email) {
            resolve(users[userKey]);
            return;
          }
        }
        resolve(null);
      })
      .catch((err) => reject(err));
  });
}

// update - deposit/withdraw amount
function updateBalance(email, amount) {
  return new Promise((resolve, reject) => {
    const usersRef = ref(db, 'users');
    get(usersRef)
      .then((snapshot) => {
        const users = snapshot.val();
        for (const userKey in users) {
          if (users[userKey].email === email) {
            const updatedBalance = users[userKey].balance + amount;
            update(ref(db, `users/${userKey}`), { balance: updatedBalance })
              .then(() => resolve({ ...users[userKey], balance: updatedBalance }))
              .catch((err) => reject(err));
            return;
          }
        }
        resolve(null);
      })
      .catch((err) => reject(err));
  });
}

// all users
function all() {
  return new Promise((resolve, reject) => {
    const usersRef = ref(db, 'users');
    get(usersRef)
      .then((snapshot) => resolve(snapshot.val()))
      .catch((err) => reject(err));
  });
}

module.exports = {
  create,
  findOne,
  find,
  update: updateBalance,
  all
};
