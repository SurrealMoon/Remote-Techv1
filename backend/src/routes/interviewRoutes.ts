import express from 'express';
import { createInterview, getInterviews, getQuestionPackages, updateInterview, deleteInterview } from '../controllers/interviewController';


const router = express.Router();

// Tüm mülakatları alma
router.get('/interviews', getInterviews);

// Yeni bir mülakat oluşturma
router.post('/interviews', createInterview);

// Mülakat güncelleme
router.put('/interviews/:id', updateInterview);

// Mülakat silme
router.delete('/interviews/:id', deleteInterview);


// Soru paketlerini çekme
router.get('/question-packages', getQuestionPackages);

export default router;
