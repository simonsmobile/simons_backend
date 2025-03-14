// controllers/questionnaire.controller.js
const express = require('express');
const httpStatus = require('http-status');
const QuestionnaireService = require('../services/questionaires.service');

const router = express.Router();

router.post("/add", async (req, res) => {
  const { title, description, questions } = req.body;
  const questionnaire = { title, description, questions };

  try {
    const newQuestionnaire = await QuestionnaireService.createQuestionnaire(questionnaire);
    res.status(httpStatus.CREATED).send(newQuestionnaire);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const questionnaires = await QuestionnaireService.getAllQuestionnaires();
    res.status(httpStatus.OK).send(questionnaires);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const questionnaire = await QuestionnaireService.getQuestionnaireById(id);
    res.status(httpStatus.OK).send(questionnaire);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.NOT_FOUND).send({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await QuestionnaireService.deleteQuestionnaire(id);
    res.status(httpStatus.OK).send(result);
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Server error" });
  }
});

module.exports = router;
