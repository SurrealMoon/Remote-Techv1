import { Request, Response } from 'express';
import Candidate from '../models/candidateModel';

export const createCandidate = async (req: Request, res: Response) => {
    try {
        console.log("Request Body:", req.body);
        const { firstName, lastName, email, phone, interviewId } = req.body; // phoneNumber yerine phone kullan

        // Telefon numarası formatını kontrol et
        const phoneRegex = /^[0-9]{1,15}$/; // Sadece rakamlardan oluşan 1-15 hane arası
        if (!phone || !phoneRegex.test(phone)) {
            console.error("Invalid phone format:", phone);
             res.status(400).json({ message: 'Geçersiz telefon numarası formatı.' });
             return
        }

        // Aynı email veya telefon ile bir adayın olup olmadığını kontrol et
        const existingCandidate = await Candidate.findOne({ $or: [{ email }, { phone }] });
        if (existingCandidate) {
            console.error("Existing candidate found:", existingCandidate);
             res.status(400).json({ message: 'Bu e-posta adresi veya telefon numarası ile zaten bir aday mevcut.' });
             return
        }

        // Yeni aday oluştur
        const newCandidate = new Candidate({
            firstName,
            lastName,
            email,
            phone,
            interviewId,
        });

        await newCandidate.save();
        console.log("Candidate successfully created:", newCandidate);
        res.status(201).json(newCandidate);
    } catch (error: any) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ message: error.message });
    }
};




// Gerekirse aday bilgilerini listeleme veya güncelleme işlemleri için diğer fonksiyonları buraya ekleyebilirsiniz.
