import { Router } from 'express';
import loginAdmin from '../controllers/adminLoginController';

const router = Router();

// Admin login route
router.post('/admin/login', loginAdmin);

export default router;