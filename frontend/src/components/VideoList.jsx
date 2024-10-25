// src/components/VideoList.jsx
import React from 'react';

const VideoList = ({ videos }) => {
    return (
        <div className="video-list">
            {videos.length > 0 ? (
                videos.map((video, index) => (
                    <div key={index} className="video-item">
                        <h3>Video {index + 1}</h3>
                        <video width="400" controls>
                            <source src={video.src} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                ))
            ) : (
                <div className="no-videos">
                    <p>Henüz video yok.</p>
                </div>
            )}
        </div>
    );
};

export default VideoList;
