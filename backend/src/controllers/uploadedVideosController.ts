import { Request, Response } from 'express';
import Video from '../models/uploadedVideosModel';
import Candidate from '../models/candidateModel';

// Belirli bir mülakata ait videoları getirme
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

// Videoya yorum ekleme veya güncelleme
export const saveComment = async (req: Request, res: Response) => {
    const { videoId } = req.params;
    const { comment } = req.body;

    console.log('Video ID:', videoId); // Video ID kontrol
    console.log('Received Comment:', comment); // Gelen yorumu kontrol

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            console.error('Video not found.');
            return res.status(404).json({ message: 'Video not found.' });
        }

        // Yorum ekleme veya güncelleme
        video.comment = comment;
        await video.save();

        console.log('Updated Video:', video); // Güncellenen video
        res.status(200).json({ message: 'Comment saved successfully.', video });
    } catch (error) {
        console.error('Error saving comment:', error);
        res.status(500).json({ message: 'Error saving comment.' });
    }
};


// Videoyu silme
export const deleteVideo = async (req: Request, res: Response) => {
    let { videoId } = req.params;

    try {
        // videoId'yi temizle (extra boşluk veya yeni satır karakterlerini kaldır)
        videoId = videoId.trim();

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video bulunamadı.' });
        }

        await Video.findByIdAndDelete(videoId);
        res.status(200).json({ message: 'Video başarıyla silindi.' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ message: 'Error deleting video.' });
    }
};

