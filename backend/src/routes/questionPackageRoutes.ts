import { Router, Request, Response } from 'express';
import { createQuestionPackage, getQuestionPackages, updateQuestionPackage, deleteQuestionPackage } from '../controllers/questionPackageControllers';

const router = Router();

router.post('/question-package', (req: Request, res: Response) => createQuestionPackage(req, res));
router.get('/question-packages', (req: Request, res: Response) => getQuestionPackages(req, res));
router.put('/question-package/:id', async (req: Request, res: Response) => await updateQuestionPackage(req, res));
router.delete('/question-package/:id', async (req: Request, res: Response) => await deleteQuestionPackage(req, res));
export default router;
