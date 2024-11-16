import express from 'express';
import { getVideosByInterview } from '../controllers/uploadedVideosController';

const router = express.Router();

// Belirli bir mülakat için videoları getir
router.get('/:interviewId', getVideosByInterview);

export default router;
