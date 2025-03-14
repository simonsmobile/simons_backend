const firebase = require('firebase-admin');

var serviceAccount = require("../../db.json");

var db = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

module.exports = db;