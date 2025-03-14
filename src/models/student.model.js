// models/student.model.js
const firebase = require('../configs/db');
const firestore = firebase.firestore();

class Student {
  constructor(id, email, fullName, dob, gender, country, password, firstName, lastName, university, universityId, placeholder, approved = true, status) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = fullName;
    this.dob = dob;
    this.gender = gender;
    this.country = country;
    this.university = university;
    this.universityId = universityId;
    this.placeholder = placeholder;
    this.approved = approved;
    this.status = status
  }
}

const studentCollection = firestore.collection("students");

module.exports = { Student, studentCollection };
