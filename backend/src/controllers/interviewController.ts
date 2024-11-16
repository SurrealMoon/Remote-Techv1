import { Request, Response } from 'express';
import Interview from '../models/interviewModel';
import QuestionPackage from '../models/questionPackageModel';

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
        const { title, date, canSkip, showAtOnce, selectedPackage, customQuestions } = req.body;

        // `customQuestions` alanını doğru formatta işle
        const formattedCustomQuestions = customQuestions?.map((q: any) => {
            if (typeof q === 'string') {
                return { questionText: q, time: 1 }; // String ise varsayılan süre ata
            } else if (typeof q.questionText === 'string' && typeof q.time === 'number') {
                return q; // Doğru formatta ise olduğu gibi bırak
            } else {
                throw new Error('Invalid custom question format');
            }
        });

        const newInterview = new Interview({
            title,
            date,
            canSkip,
            showAtOnce,
            selectedPackage,
            customQuestions: formattedCustomQuestions || []
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
        // `customQuestions` alanını formatla
        if (req.body.customQuestions) {
            req.body.customQuestions = req.body.customQuestions.map((q: any) => {
                if (typeof q === 'string') {
                    return { questionText: q, time: 1 }; // String ise varsayılan süre ata
                } else if (typeof q.questionText === 'string' && typeof q.time === 'number') {
                    return q; // Doğru formatta ise olduğu gibi bırak
                } else {
                    throw new Error('Invalid custom question format');
                }
            });
        }

        const updatedInterview = await Interview.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedInterview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        res.status(200).json(updatedInterview);
    } catch (error: any) {
        console.error('Error updating interview:', error.message);
        res.status(500).json({ message: error.message });
    }
};

// Mülakat Silme
export const deleteInterview = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedInterview = await Interview.findByIdAndDelete(id);
        if (!deletedInterview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        res.status(200).json({ message: 'Interview successfully deleted' });
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

// ID'ye göre mülakat getirme
export const getInterviewById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const interview = await Interview.findById(id);
        if (!interview) {
            console.warn("Interview not found for ID:", id);
            return res.status(404).json({ message: 'Interview not found' });
        }

        // `customQuestions` alanını doğrula ve dönüştür
        const formattedCustomQuestions = interview.customQuestions.map((q: any) =>
            typeof q === 'string'
                ? { questionText: q, time: 1 }
                : q
        );

        res.status(200).json({ ...interview.toObject(), customQuestions: formattedCustomQuestions });
    } catch (error: any) {
        console.error("Error fetching interview:", error.message);
        res.status(500).json({ message: 'An error occurred, please try again.' });
    }
};
