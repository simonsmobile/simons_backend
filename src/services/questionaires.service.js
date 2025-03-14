// services/questionnaire.service.js
const { Questionnaire, questionnaireCollection } = require('../models/questionaire.model');

class QuestionnaireService {
  async createQuestionnaire(questionnaire) {
    const newQuestionnaire = {
      title: questionnaire.title,
      description: questionnaire.description,
      questions: questionnaire.questions
    };
    const questionnaireRef = await questionnaireCollection.add(newQuestionnaire);
    return { id: questionnaireRef.id, ...newQuestionnaire };
  }

  async getAllQuestionnaires() {
    const querySnapshot = await questionnaireCollection.get();
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getQuestionnaireById(id) {
    const doc = await questionnaireCollection.doc(id).get();
    if (!doc.exists) {
      throw new Error('Questionnaire not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  async deleteQuestionnaire(id) {
    await questionnaireCollection.doc(id).delete();
    return { message: "Questionnaire deleted successfully" };
  }
}

module.exports = new QuestionnaireService();
