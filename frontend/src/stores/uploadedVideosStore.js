import { create } from 'zustand';
import { getVideosByInterview } from '../services/uploadedVideosService';

const useVideoStore = create((set) => ({
  videos: [],
  fetchVideos: async (interviewId) => {
    try {
      const videos = await getVideosByInterview(interviewId);
      set({ videos });
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  },
}));

export default useVideoStore;
