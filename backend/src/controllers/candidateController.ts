import { Request, Response } from 'express';
import Candidate from '../models/candidateModel';

export const createCandidate = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, interviewId } = req.body;
        const newCandidate = new Candidate({
            firstName,
            lastName,
            email,
            interviewId
        });
        await newCandidate.save();
        res.status(201).json(newCandidate);
    } catch (error: any) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ message: error.message });
    }
};

// Gerekirse aday bilgilerini listeleme veya güncelleme işlemleri için diğer fonksiyonları buraya ekleyebilirsiniz.
