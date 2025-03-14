// models/questionnaire.model.js
const firebase = require('../configs/db');
const firestore = firebase.firestore();

class Questionnaire {
  constructor(id, title, description, questions) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.questions = questions;
  }
}

const questionnaireCollection = firestore.collection("questionnaires");

module.exports = { Questionnaire, questionnaireCollection };
