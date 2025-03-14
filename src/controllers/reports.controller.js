// controllers/report.controller.js
const express = require('express');
const httpStatus = require('http-status');
const ReportService = require('../services/reports.service');

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const reports = await ReportService.getAllReports();
    res.status(httpStatus.OK).send(reports);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Server error" });
  }
});

router.get("/ofUser/:user", async (req, res) => {
  let user = req.params.user;
  try {
    const reports = await ReportService.getReportsByUser(user);
    res.status(httpStatus.OK).send(reports);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Server error" });
  }
});

router.post("/add", async (req, res) => {
  const { date, cause, reportedBy, examMarks, dateTotalQuestions, comments } = req.body;
  const report = { date, cause, reportedBy, examMarks, dateTotalQuestions, comments };
  try {
    const customId = await ReportService.addReport(report);
    res.status(httpStatus.CREATED).send({ message: "Report Entered", id: customId });
  } catch (error) {
    console.error(error);
    res.status(httpStatus.SERVICE_UNAVAILABLE).send({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await ReportService.deleteReport(req.params.id);
    res.status(httpStatus.OK).send({ message: "Report Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const report = await ReportService.getReportById(id);
    res.status(httpStatus.OK).send(report);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.SERVICE_UNAVAILABLE).send({ message: "Server Error has occurred" });
  }
});

module.exports = router;
