import { Request, Response } from 'express';
import Video from '../models/uploadedVideosModel';

export const getVideosByInterview = async (req: Request, res: Response) => {
  const { interviewId } = req.params;

  try {
    const videos = await Video.find({ interviewId });

    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: 'No videos found for this interview.' });
    }

    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Error fetching videos.' });
  }
};
