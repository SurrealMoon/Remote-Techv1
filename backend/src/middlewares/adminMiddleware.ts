import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecretkey';

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Yetkisiz erişim, token gerekli.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // 'user' özelliğini isteğe ekliyoruz
        next();
    } catch (error) {
        res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token.' });
    }
}

export default authMiddleware;
