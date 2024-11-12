import express from 'express';
import {
    createQuestionPackage,
    getQuestionPackages,
    updateQuestionPackage,
    deleteQuestionPackage,
    addQuestionToPackage,
    updateQuestionInPackage,
    deleteQuestionFromPackage,
    reorderQuestionsInPackage,
    getQuestionsInPackage
} from '../controllers/questionPackageController';

const router = express.Router();

// CRUD İşlemleri
router.post('/question-packages', createQuestionPackage);
router.get('/question-packages', getQuestionPackages);
router.put('/question-packages/:id', updateQuestionPackage);
router.delete('/question-packages/:id', deleteQuestionPackage);

// Soru ekleme, güncelleme, silme ve sıralama işlemleri
router.post('/question-packages/:packageId/questions', addQuestionToPackage);
router.get('/question-packages/:packageId/questions', getQuestionsInPackage);
router.put('/question-packages/:packageId/questions/:questionId', updateQuestionInPackage);
router.delete('/question-packages/:packageId/questions/:questionId', deleteQuestionFromPackage);
router.put('/question-packages/:packageId/questions/reorder', reorderQuestionsInPackage);

// Belirli bir paket kimliğine göre soruları getirme işlemi
router.get('/question-packages/:packageId/questions', getQuestionsInPackage);



export default router;
