import express from 'express';
import { createInterview, getInterviews } from '../controllers/interviewController';

const router = express.Router();

// Tüm görüşmeleri alma
router.get('/interviews', getInterviews);

// Yeni bir görüşme oluşturma
router.post('/interviews', createInterview);

export default router;