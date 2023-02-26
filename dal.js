// import { getDatabase, ref, push, get, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBHL4Bz-e1sBlSmZMi_2rcQf04ACfWxRko",
    authDomain: "capstone-badbank-dfd1f.firebaseapp.com",
    databaseURL: "https://capstone-badbank-dfd1f-default-rtdb.firebaseio.com",
    projectId: "capstone-badbank-dfd1f",
    storageBucket: "capstone-badbank-dfd1f.appspot.com",
    messagingSenderId: "457999178063",
    appId: "1:457999178063:web:2ae0bf5d495e908400cd3a"
  
};

// Initialize Firebase using the configuration object
initializeApp(firebaseConfig);

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

// export { create, findOne, find, updateBalance as update, all };
