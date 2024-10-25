import { Request, Response } from 'express';
import Interview from '../models/interviewModel';

export const getInterviews = async (req: Request, res: Response) => {
    try {
        const interviews = await Interview.find();
        res.status(200).json(interviews);
    } catch (error: any) {  // `any` ile hata türünü belirtiyoruz
        res.status(500).json({ message: error.message });
    }
};

export const createInterview = async (req: Request, res: Response) => {
    try {
        const newInterview = new Interview(req.body);
        await newInterview.save();
        res.status(201).json(newInterview);
    } catch (error: any) {  // Burada da `any` kullanarak hata türünü belirtmeliyiz
        res.status(500).json({ message: error.message });
    }
};