import { Request, Response } from 'express';
import Candidate from '../models/candidateModel';

export const createCandidate = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, interviewId } = req.body;

        // Aynı email ile bir adayın olup olmadığını kontrol et
        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
            return res.status(400).json({ message: 'Bu e-posta adresi ile zaten bir aday mevcut.' });
        }

        // Eğer aynı email yoksa yeni aday ekle
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
