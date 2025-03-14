// services/student.service.js
const { Student, studentCollection } = require('../models/student.model');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const admin = require('firebase-admin');

const SECRET_KEY = "jwt_secret";

class StudentService {
  async createStudent(student) {
    console.log(student);
    const querySnapshot = await studentCollection.where("email", "==", student.email).get();
    if (!querySnapshot.empty) {
      throw new Error("A user already exists under give Email Address");
    }
    const encryptedPassword = CryptoJS.AES.encrypt(student.password, SECRET_KEY).toString();
    const newStudent = {
      email: student.email,
      password: encryptedPassword,
      fullName: student.fullName,
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender,
      dob: student.dob,
      country: student.country,
      university: student.university,
      universityId: student.universityId,
      placeholder: student.placeholder,
      approved: student.approved,
      status: "Not Passed"
    };
    const studentRef = await studentCollection.add(newStudent);
    return { id: studentRef.id, ...newStudent };
  }

  async login(email, password) {
    const querySnapshot = await studentCollection.where("email", "==", email).get();
    if (querySnapshot.empty) {
      throw new Error("Invalid email or password");
    }

    const studentDoc = querySnapshot.docs[0];
    const studentData = studentDoc.data();
    const decryptedPassword = CryptoJS.AES.decrypt(studentData.password, SECRET_KEY).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== password) {
      throw new Error("Invalid email or password");
    }

    if (!studentData.approved) {
      throw new Error("Your Account is not verified");
    }

    const token = jwt.sign({ id: studentDoc.id, email: studentData.email }, SECRET_KEY, { expiresIn: '1h' });
    return { token, student: { id: studentDoc.id, email: studentData.email, firstName: studentData.firstName, 
      lastName: studentData.lastName, universityId: studentData.universityId, placeholder: studentData.placeholder, 
      approved: studentData.approved, status: studentData.status } };
  }

  async getStudentByEmail(email) {
    const querySnapshot = await studentCollection.where("email", "==", email).get();
    if (querySnapshot.empty) {
      throw new Error("Student not found");
    }

    const studentDoc = querySnapshot.docs[0];
    const studentData = studentDoc.data();
    const { password, ...studentWithoutPassword } = studentData;

    return { id: studentDoc.id, ...studentWithoutPassword };
  }

  async updateStudentByEmail(email, updates) {
    const querySnapshot = await studentCollection.where("email", "==", email).get();
    if (querySnapshot.empty) {
      throw new Error("Student not found");
    }

    const studentDoc = querySnapshot.docs[0];
    const studentRef = studentCollection.doc(studentDoc.id);

    if (updates.password) {
      updates.password = CryptoJS.AES.encrypt(updates.password, SECRET_KEY).toString();
    }

    await studentRef.update(updates);
    return { id: studentDoc.id, ...updates };
  }

  async deleteStudentByEmail(email) {
    const querySnapshot = await studentCollection.where("email", "==", email).get();
    if (querySnapshot.empty) {
      throw new Error("Student not found");
    }

    const studentDoc = querySnapshot.docs[0];
    const studentRef = studentCollection.doc(studentDoc.id);

    await studentRef.delete();
    return { id: studentDoc.id, message: 'Student deleted successfully' };
  }

  async sendEmail( recipient_email, OTP ) {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.MY_PASSWORD,
        },
      });
      console.log(process.env.MY_EMAIL);
  
      const mail_configs = {
        from: process.env.MY_EMAIL,
        to: recipient_email,
        subject: "SimONS application - Password Recovery",
        html: `<!DOCTYPE html>
  <html lang="en" >
  <head>
    <meta charset="UTF-8">
    <title>SimOns Password Recovery Code</title>
    
  
  </head>
  <body>
  <!-- partial:index.partial.html -->
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">SimONS Application</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Use the following OTP to complete your Password Recovery Procedure. OTP is valid for Single session</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
      <p style="font-size:0.9em;">Regards,<br />SimONS</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>SimONS</p>
        <p>Sri Lanka</p>
      </div>
    </div>
  </div>
  <!-- partial -->
    
  </body>
  </html>`,
      };
      transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
          console.log(error);
          return reject({ message: `An error has occured` });
        }
        return resolve({ message: "Email sent succesfuly" });
      });
    });
  }

  async sendOTP( recipient_email, OTP ) {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.MY_PASSWORD,
        },
      });
      console.log(process.env.MY_EMAIL);
  
      const mail_configs = {
        from: process.env.MY_EMAIL,
        to: recipient_email,
        subject: "SimONS application - Create Account",
        html: `<!DOCTYPE html>
  <html lang="en" >
  <head>
    <meta charset="UTF-8">
    <title>SimOns OTP Code</title>
    
  
  </head>
  <body>
  <!-- partial:index.partial.html -->
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">SimONS Application</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing SimONS mobile application. Use the following OTP to confirm your account. OTP is valid for Single session</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
      <p style="font-size:0.9em;">Regards,<br />SimONS</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>SimONS</p>
        <p>Sri Lanka</p>
      </div>
    </div>
  </div>
  <!-- partial -->
    
  </body>
  </html>`,
      };
      transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
          console.log(error);
          return reject({ message: `An error has occured` });
        }
        return resolve({ message: "Email sent succesfuly" });
      });
    });
  }

  async resetPassword(email, newPassword) {

    const querySnapshot = await studentCollection.where("email", "==", email).get();
    if (querySnapshot.empty) {
      throw new Error("Student not found");
    }

    const studentDoc = querySnapshot.docs[0];
    const studentRef = studentCollection.doc(studentDoc.id);

    const encryptedPassword = CryptoJS.AES.encrypt(newPassword, SECRET_KEY).toString();
    await studentRef.update({ password: encryptedPassword });

    return { id: studentDoc.id, message: 'Password reset successfully' };
  }

  // Test Results
  async addTestToStudent(email, testData) {
    // Step 1: Fetch the student document by email
    const querySnapshot = await studentCollection.where("email", "==", email).get();
    if (querySnapshot.empty) {
      throw new Error("Student not found");
    }
  
    const studentDoc = querySnapshot.docs[0];
    const studentRef = studentCollection.doc(studentDoc.id);
  
    // Step 2: Determine the next document number in the 'tests' subcollection
    const testsCollectionRef = studentRef.collection('tests');
    const testsSnapshot = await testsCollectionRef.get();
  
    const nextTestNumber = testsSnapshot.size + 1;
    const testDocumentName = nextTestNumber.toString();
  
    // Step 3: Add a new document to the 'tests' subcollection with a timestamp
    const newTestRef = testsCollectionRef.doc(testDocumentName);
    await newTestRef.set({
      ...testData,
      timestamp: admin.firestore.FieldValue.serverTimestamp() // Add a timestamp field
    });
  
    return { id: newTestRef.id, ...testData };
  }
  

  async getFirstAndLastTest(email) {
    // Step 1: Fetch the student document by email
    const querySnapshot = await studentCollection.where("email", "==", email).get();
    if (querySnapshot.empty) {
      throw new Error("Student not found");
    }
  
    const studentDoc = querySnapshot.docs[0];
    const studentRef = studentCollection.doc(studentDoc.id);
  
    // Step 2: Retrieve the first and last test documents based on the timestamp
    const testsCollectionRef = studentRef.collection('tests');
  
    // Get the first test
    const firstTestQuery = await testsCollectionRef.orderBy('timestamp').limit(1).get();
    const firstTestDoc = firstTestQuery.empty ? null : firstTestQuery.docs[0].data();
  
    // Get the last test
    const lastTestQuery = await testsCollectionRef.orderBy('timestamp', 'desc').limit(1).get();
    const lastTestDoc = lastTestQuery.empty ? null : lastTestQuery.docs[0].data();
  
    // Step 3: Return the results
    return {
      firstTest: firstTestDoc,
      lastTest: lastTestDoc
    };
  }
  
}

module.exports = new StudentService();
