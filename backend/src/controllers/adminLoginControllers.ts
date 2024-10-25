import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/adminLoginModel';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecretkey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const MASTER_ADMIN_PASSWORD = process.env.MASTER_ADMIN_PASSWORD || '1234';

async function loginAdmin(req: Request, res: Response) {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin || password !== MASTER_ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({ message: 'Giriş başarılı', token });
    } catch (error) {
        console.error('Admin giriş hatası:', error);
        res.status(500).json({ message: 'Giriş işlemi sırasında bir hata oluştu.' });
    }
}

export default loginAdmin;
