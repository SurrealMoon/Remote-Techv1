import React, { useEffect } from 'react';
import './SeeVideos.css';
import useVideoStore from '../stores/uploadedVideosStore';

const SeeVideos = ({ interviewId }) => {
  const { videos, fetchVideos } = useVideoStore();

  useEffect(() => {
    if (interviewId) {
      fetchVideos(interviewId);
    }
  }, [interviewId, fetchVideos]);

  return (
    <div className="video-page">
      <h1>Videolar</h1>
      {videos.length > 0 ? (
        <div className="video-list">
          {videos.map((video, index) => (
            <div key={video._id} className="video-item">
              <h3>Video {index + 1}</h3>
              <video width="400" controls>
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      ) : (
        <p>No videos recorded yet.</p>
      )}
    </div>
  );
};

export default SeeVideos;
