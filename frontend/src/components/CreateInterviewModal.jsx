import React, { useState, useEffect } from 'react';
import './CreateInterviewModal.css';

const CreateInterviewModal = ({ onAddInterview, onClose, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [selectedPackage, setSelectedPackage] = useState(initialData?.selectedPackage || '');
    const [date, setDate] = useState(initialData?.date || '');
    const [canSkip, setCanSkip] = useState(initialData?.canSkip || false);
    const [showAtOnce, setShowAtOnce] = useState(initialData?.showAtOnce || false);
    const [packages, setPackages] = useState([]);
    const [customQuestions, setCustomQuestions] = useState(initialData?.customQuestions || ['']);

    const handleClickOutside = (e) => {
        if (e.target.className === 'modal-overlay') {
            onClose();
        }
    };

    useEffect(() => {
        const storedPackages = JSON.parse(localStorage.getItem('questionPackages')) || [];
        setPackages(storedPackages);

        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleSubmit = () => {
        if (!title || !selectedPackage || !date) {
            alert('Please fill in all required fields');
            return;
        }

        const newInterview = {
            id: initialData ? initialData.id : Date.now(),
            title,
            selectedPackage,
            date,
            canSkip,
            showAtOnce,
            customQuestions
        };
        onAddInterview(newInterview);
        onClose();
    };

    const handleAddQuestion = () => {
        setCustomQuestions([...customQuestions, '']);
    };

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...customQuestions];
        updatedQuestions[index] = value;
        setCustomQuestions(updatedQuestions);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? 'Edit Interview' : 'Create Interview'}</h2>
                
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

                <h3>Custom Questions</h3>
                <div className="custom-questions-container">
                    {customQuestions.map((question, index) => (
                        <div key={index} className="custom-question">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                                placeholder={`Question ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
                <button className="add-question-btn" onClick={handleAddQuestion}>Add Question</button>

                <button 
                    className="create-btn" 
                    onClick={handleSubmit} 
                    disabled={!title || !selectedPackage || !date}
                >
                    {initialData ? 'Save' : 'Create'}
                </button>
                <button className="cancel-btn" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default CreateInterviewModal;
