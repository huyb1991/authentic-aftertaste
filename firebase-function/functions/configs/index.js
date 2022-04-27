const functions = require('firebase-functions');
const firebase = require('firebase-admin');

// Config firebase
const firebaseApp = firebase.initializeApp(
  functions.config().firebase
);

module.exports.firebase = {
  database: firebaseApp.firestore()
}