import React, { useState, useEffect } from 'react';
import './CreateInterviewModal.css';

const CreateInterviewModal = ({ onAddInterview, onClose }) => {
    const [title, setTitle] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('');
    const [date, setDate] = useState('');
    const [canSkip, setCanSkip] = useState(false);
    const [showAtOnce, setShowAtOnce] = useState(false);
    const [packages, setPackages] = useState([]); // Soru paketlerini tutacak state

    useEffect(() => {
        // localStorage'dan paketleri çekme
        const storedPackages = JSON.parse(localStorage.getItem('questionPackages')) || [];
        setPackages(storedPackages);
    }, []);

    const handleSubmit = () => {
        if (!title || !selectedPackage || !date) {
            alert('Please fill in all required fields');
            return;
        }

        const newInterview = {
            title,
            selectedPackage,
            date,
            canSkip,
            showAtOnce
        };
        onAddInterview(newInterview);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create Interview</h2>
                <label>Title</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter interview title" 
                />
                <label>Select Question Package</label>
                <select 
                    value={selectedPackage} 
                    onChange={(e) => setSelectedPackage(e.target.value)}
                >
                    <option value="">Select a package</option>
                    {packages.map((pkg, index) => (
                        <option key={index} value={pkg.name}>{pkg.name}</option>
                    ))}
                </select>
                <label>Interview Date</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                />
                <div className="checkbox-group">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={canSkip} 
                            onChange={(e) => setCanSkip(e.target.checked)} 
                        />
                        Can Skip
                    </label>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={showAtOnce} 
                            onChange={(e) => setShowAtOnce(e.target.checked)} 
                        />
                        Show At Once
                    </label>
                </div>
                <button className="create-btn" onClick={handleSubmit}>Create</button>
                <button className="cancel-btn" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default CreateInterviewModal;
