import React from 'react';
import './InterviewList.css';

function InterviewList({ interviews }) {
  return (
    <div className="interview-list">
      {interviews.map((interview, index) => (
        <div key={index} className="interview-card">
          <h3>{interview.title}</h3>
          <p>Package: {interview.packageSelection}</p>
          <p>Date: {interview.date}</p>
          <button>See Videos</button>
        </div>
      ))}
    </div>
  );
}

export default InterviewList;
