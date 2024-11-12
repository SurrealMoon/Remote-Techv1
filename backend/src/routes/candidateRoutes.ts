import express from 'express';
import { createCandidate } from '../controllers/candidateController';

const router = express.Router();

router.post('/candidates', createCandidate);

// İleride adayla ilgili başka işlemler eklerseniz burada tanımlayabilirsiniz.

export default router;
