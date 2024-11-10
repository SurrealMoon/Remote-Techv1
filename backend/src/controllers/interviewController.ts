import { Request, Response } from 'express';
import Interview from '../models/interviewModel';
import QuestionPackage from '../models/questionPackageModel'; // Soru paketleri modeli eklendi

// Mülakatları listeleme
export const getInterviews = async (req: Request, res: Response) => {
    try {
        const interviews = await Interview.find();
        res.status(200).json(interviews);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Yeni mülakat oluşturma
export const createInterview = async (req: Request, res: Response) => {
    try {
        const { title, date, canSkip, showAtOnce, selectedPackage, customQuestions } = req.body; // Yeni alanlar alındı
        const newInterview = new Interview({
            title,
            date,
            canSkip,
            showAtOnce,
            selectedPackage, // Seçilen soru paketi
            customQuestions   // Kullanıcının girdiği özel sorular
        });
        await newInterview.save();
        res.status(201).json(newInterview);
    } catch (error: any) {
        console.error('Error while creating interview:', error);
        res.status(500).json({ message: error.message });
    }
};

// Mülakat güncelleme
export const updateInterview = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedInterview = await Interview.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedInterview) {
            return res.status(404).json({ message: 'Mülakat bulunamadı' });
        }
        res.status(200).json(updatedInterview);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Mülakat Silme
export const deleteInterview = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedInterview = await Interview.findByIdAndDelete(id);
        if (!deletedInterview) {
            return res.status(404).json({ message: 'Mülakat bulunamadı' });
        }
        res.status(200).json({ message: 'Mülakat başarıyla silindi' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Soru paketlerini getirme işlevi
export const getQuestionPackages = async (req: Request, res: Response) => {
    try {
        const packages = await QuestionPackage.find();
        res.status(200).json(packages);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
