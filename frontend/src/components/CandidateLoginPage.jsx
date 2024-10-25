import React, { useState } from 'react';
import './CandidateLoginPage.css';

const CandidateLoginPage = ({ onLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName && lastName && email) {
      const candidateInfo = { firstName, lastName, email };
      localStorage.setItem('candidateInfo', JSON.stringify(candidateInfo)); // Aday bilgilerini kaydet
      onLogin(candidateInfo); // Giriş yap
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="candidate-login-page">
      <h2>Candidate Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default CandidateLoginPage;
