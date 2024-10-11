import { Request, Response } from 'express';

export const getInterviews = (req: Request, res: Response) => {
    // Görüşmeleri veritabanından al
    res.json({ message: 'Görüşmeler listelenecek' });
};

export const createInterview = (req: Request, res: Response) => {
    // Yeni bir görüşme oluştur
    res.status(201).json({ message: 'Görüşme oluşturuldu' });
};