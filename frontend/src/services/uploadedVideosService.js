import axios from 'axios';

export const getVideosByInterview = async (interviewId) => {
  try {
    const response = await axios.get(`/api/videos/${interviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};
