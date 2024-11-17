import { Request, Response } from 'express';
import Video from '../models/uploadedVideosModel';
import Candidate from '../models/candidateModel';

export const getVideosByInterview = async (req: Request, res: Response) => {
    const { interviewId } = req.params;

    try {
        const videos = await Video.find({ interviewId });

        if (!videos || videos.length === 0) {
            return res.status(404).json({ message: 'No videos found for this interview.' });
        }

        // Videoların yanında aday bilgilerini de alın
        const detailedVideos = await Promise.all(
            videos.map(async (video) => {
                const candidate = await Candidate.findById(video.candidateId);
                return {
                    ...video.toObject(),
                    candidate: candidate ? {
                        firstName: candidate.firstName,
                        lastName: candidate.lastName,
                        email: candidate.email,
                        phone: candidate.phone, // Telefon bilgisi
                    } : null,
                };
            })
        );

        res.status(200).json(detailedVideos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ message: 'Error fetching videos.' });
    }
};
