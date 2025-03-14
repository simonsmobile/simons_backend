const express = require('express');
const reportController = require('../controllers/reports.controller');
const authstController = require('../controllers/students.controller');
const questionairesController = require('../controllers/questionaires.controller');
const router = express.Router();

router.get('/check', (req, res) => console.log("App is working"))

// MAIN ROUTES
router.use('/reports', reportController)
router.use('/auth', authstController)
router.use('/questionaires', questionairesController)

module.exports = router;