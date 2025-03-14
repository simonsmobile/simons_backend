// models/report.model.js
const firebase = require('../configs/db');
const firestore = firebase.firestore();

class Report {
  constructor(id, date, cause, reportedBy, examMarks, dateTotalQuestions, comments) {
    this.id = id;
    this.date = date;
    this.cause = cause;
    this.reportedBy = reportedBy;
    this.examMarks = examMarks;
    this.dateTotalQuestions = dateTotalQuestions;
    this.comments = comments;
  }
}

const reportCollection = firestore.collection("reports");

module.exports = { Report, reportCollection };
