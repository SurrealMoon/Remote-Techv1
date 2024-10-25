import { Request, Response } from 'express';
import QuestionPackage from '../models/questionPackageModel';

// soru paketi ekleme(create)
export const createQuestionPackage = async (req: Request, res: Response) => {
    try {
        const newPackage = new QuestionPackage(req.body);
        await newPackage.save();
        res.status(201).json(newPackage);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
// soru paketi listeleme (read)
export const getQuestionPackages = async (req: Request, res: Response) => {
    try {
        const packages = await QuestionPackage.find();
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// soru paketi güncelleme (update)
export const updateQuestionPackage = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedPackage = await QuestionPackage.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPackage) {
            return res.status(404).json({ message: 'Paket bulunamadı' });
        }
        res.status(200).json(updatedPackage);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// soru paketi silme (delete)
export const deleteQuestionPackage = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedPackage = await QuestionPackage.findByIdAndDelete(id);
        if (!deletedPackage) {
            return res.status(404).json({ message: 'Paket bulunamadı' });
        }
        res.status(200).json({ message: 'Paket silindi' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
