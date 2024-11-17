import { Request, Response } from 'express';
import QuestionPackage from '../models/questionPackageModel';

// Soru paketi ekleme (create)
export const createQuestionPackage = async (req: Request, res: Response) => {
    try {
        const newPackage = new QuestionPackage(req.body);
        await newPackage.save();
        res.status(201).json(newPackage);
    } catch (error) {
        console.error('Error in createQuestionPackage:', error); // Hata mesajını terminalde görebilmek için
        res.status(500).json({ message: (error as Error).message });
    }
};


// Soru paketi listeleme (read)
export const getQuestionPackages = async (req: Request, res: Response) => {
    try {
        const packages = await QuestionPackage.find();
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getQuestionsInPackage = async (req: Request, res: Response) => {
    const { packageId } = req.params;

    try {
        const questionPackage = await QuestionPackage.findById(packageId);
        if (!questionPackage) {
            return res.status(404).json({ message: 'Soru paketi bulunamadı' });
        }
        res.status(200).json(questionPackage.questions);
    } catch (error) {
        console.error('Error in getQuestionsInPackage:', error);
        res.status(500).json({ message: (error as Error).message });
    }
};
// Soru paketi güncelleme (update)
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

// Soru paketi silme (delete)
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

// Soru ekleme
export const addQuestionToPackage = async (req: Request, res: Response) => {
    const { packageId } = req.params;
    const { questionText, options = [], answer = "", time } = req.body; // Varsayılan süreyi burada kaldırıyoruz

    try {
        const questionPackage = await QuestionPackage.findById(packageId);
        if (!questionPackage) {
            return res.status(404).json({ message: 'Paket bulunamadı' });
        }

        const newQuestion = {
            questionText,
            options,
            answer,
            time: time || 2, // Eğer kullanıcı belirtmezse süre 2 dakika olsun
            order: questionPackage.questions.length + 1
        };

        questionPackage.questions.push(newQuestion);
        questionPackage.questionCount = questionPackage.questions.length;
        await questionPackage.save();

        res.status(200).json(newQuestion);
    } catch (error) {
        console.error('Error in addQuestionToPackage:', error);
        res.status(500).json({ message: (error as Error).message });
    }
};


// Soru güncelleme
export const updateQuestionInPackage = async (req: Request, res: Response) => {
    const { packageId, questionId } = req.params;

    if (!packageId || !questionId) {
        return res.status(400).json({ message: 'Package ID veya Question ID eksik.' });
    }

    const { questionText, options, answer, time, order } = req.body;

    try {
        const questionPackage = await QuestionPackage.findById(packageId);
        if (!questionPackage) {
            return res.status(404).json({ message: 'Paket bulunamadı.' });
        }

        const question = questionPackage.questions.find((q) => q._id && q._id.toString() === questionId);
        if (!question) {
            return res.status(404).json({ message: 'Soru bulunamadı.' });
        }

        question.questionText = questionText || question.questionText;
        question.options = options || question.options;
        question.answer = answer || question.answer;
        question.time = time || question.time;
        question.order = order || question.order;

        await questionPackage.save();
        res.status(200).json(questionPackage);
    } catch (error) {
        console.error('Error in updateQuestionInPackage:', error);
        res.status(500).json({ message: 'Güncelleme sırasında hata oluştu.' });
    }
};


// Soru silme
export const deleteQuestionFromPackage = async (req: Request, res: Response) => {
    const { packageId, questionId } = req.params;

    try {
        const questionPackage = await QuestionPackage.findById(packageId);
        if (!questionPackage) {
            return res.status(404).json({ message: 'Paket bulunamadı' });
        }

        const questionIndex = questionPackage.questions.findIndex((q) => q._id && q._id.toString() === questionId);
        if (questionIndex === -1) {
            return res.status(404).json({ message: 'Soru bulunamadı' });
        }

        questionPackage.questions.splice(questionIndex, 1); // Soruyu diziden kaldır
        questionPackage.questionCount = questionPackage.questions.length;
        await questionPackage.save();

        res.status(200).json(questionPackage);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Soruları yeniden sıralama
export const reorderQuestionsInPackage = async (req: Request, res: Response) => {
    const { packageId } = req.params;
    const { questions } = req.body; // Yeni sırayla gelen soru bilgileri

    try {
        const questionPackage = await QuestionPackage.findById(packageId);
        if (!questionPackage) {
            return res.status(404).json({ message: 'Paket bulunamadı' });
        }

        // Gelen sırayla `order` alanını güncelle
        questions.forEach((q: { _id: string; order: number }) => {
            const question = questionPackage.questions.find((item) => item._id && item._id.toString() === q._id);
            if (question) question.order = q.order;
        });

        await questionPackage.save();
        res.status(200).json(questionPackage);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

