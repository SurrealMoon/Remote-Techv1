import React, { useState, useEffect } from 'react';
import './CreateInterviewModal.css';
import useInterviewStore from '../stores/useInterviewStore';
import { fetchQuestionPackages } from '../services/questionPackageService';

const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const CreateInterviewModal = ({ onClose, onAddInterview, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [selectedPackage, setSelectedPackage] = useState(initialData?.selectedPackage || '');
    const [date, setDate] = useState(formatDateForInput(initialData?.date || ''));
    const [canSkip, setCanSkip] = useState(initialData?.canSkip || false);
    const [showAtOnce, setShowAtOnce] = useState(initialData?.showAtOnce || false);
    const [packages, setPackages] = useState([]);

    const [customQuestions, setCustomQuestions] = useState(
        initialData?.customQuestions?.map(q => 
            typeof q === 'string' ? { questionText: q, time: 1 } : q
        ) || []
    );


    const addInterview = useInterviewStore((state) => state.addInterview);

    useEffect(() => {
        const loadPackages = async () => {
            try {
                const data = await fetchQuestionPackages();
                setPackages(data);
            } catch (error) {
                console.error('Error fetching question packages:', error);
            }
        };
        loadPackages();
    }, []);

    useEffect(() => {
        if (initialData?.date) {
            setDate(formatDateForInput(initialData.date));
        }
    }, [initialData]);

    const handleSubmit = async () => {
        if (!title || !selectedPackage || !date) {
            alert('Please fill in all required fields');
            return;
        }
    
        if (customQuestions.some(q => !q.questionText || !q.time)) {
            alert('Please fill in all custom question fields, including time.');
            return;
        }
    
        const formattedDate = new Date(date).toISOString();
    
        const newInterview = {
            _id: initialData?._id,
            title,
            date: formattedDate,
            canSkip,
            showAtOnce,
            selectedPackage,
            customQuestions
        };
    
        console.log("Submitting Interview Data:", newInterview);
    
        try {
            if (initialData && initialData._id) {
                await onAddInterview(newInterview);
            } else {
                await addInterview(newInterview);
            }
            onClose();
        } catch (error) {
            console.error('Error while saving interview:', error);
            alert('There was an error saving the interview. Please try again.');
        }
    };    
    

    const handleAddQuestion = () => {
        setCustomQuestions([...customQuestions, { questionText: "", time: null }]); // Süre başlangıçta null
    };    

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...customQuestions];
        updatedQuestions[index][field] = value;
        setCustomQuestions(updatedQuestions);
    };    

    return (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
            <div className="modal-content">
                <h2>{initialData ? 'Edit Interview' : 'Create Interview'}</h2>

                <label>Title</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter interview title" 
                    required
                />

                <label>Select Question Package</label>
                <select 
                    value={selectedPackage} 
                    onChange={(e) => setSelectedPackage(e.target.value)}
                >
                    <option value="">Select a package</option>
                    {packages.map((pkg) => (
                        <option key={pkg._id} value={pkg._id}>{pkg.packageName}</option>
                    ))}
                </select>

                <label>Interview Date</label>
                <input 
                    type="datetime-local" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required
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
    placeholder="Question Text"
    value={question.questionText || ""}
    onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
    required
/>
<input
    type="number"
    placeholder="Time (minutes)"
    value={question.time !== null ? question.time : ""}
    onChange={(e) => handleQuestionChange(index, 'time', Number(e.target.value))}
    required
    min="1"
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
