import express from 'express';
import { getVideosByInterview, saveComment, deleteVideo } from '../controllers/uploadedVideosController';

const router = express.Router();

// Belirli bir mülakat için videoları getir
router.get('/:interviewId', getVideosByInterview);

// Videoya yorum ekleme veya güncelleme
router.put('/:videoId/comment', saveComment);

// Videoyu silme
router.delete('/:videoId', deleteVideo);

export default router;
