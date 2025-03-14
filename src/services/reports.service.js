// services/report.service.js
const { Report, reportCollection } = require('../models/report.model');

class ReportService {
  async getAllReports() {
    const querySnapshot = await reportCollection.get();
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getReportsByUser(user) {
    const querySnapshot = await reportCollection.where("reportedBy", "==", user).get();
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async addReport(report) {
    const customId = `${report.date}_${reportCollection.doc().id}`;
    await reportCollection.doc(customId).set({
      date: report.date,
      cause: report.cause,
      reportedBy: report.reportedBy,
      examMarks: report.examMarks,
      dateTotalQuestions: report.dateTotalQuestions,
      comments: report.comments
    });
    return customId;
  }

  async deleteReport(id) {
    await reportCollection.doc(id).delete();
  }

  async getReportById(id) {
    const doc = await reportCollection.doc(id).get();
    return { id: doc.id, ...doc.data() };
  }
}

module.exports = new ReportService();
