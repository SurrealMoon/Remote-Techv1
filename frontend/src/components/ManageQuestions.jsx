import React, { useState } from "react";
import "./ManageQuestions.css";

const ManageQuestions = ({ packageId, questions, onUpdateQuestions }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const handleAddQuestion = () => {
    setCurrentQuestion({ id: null, text: "", timeLimit: 0 });
    setModalOpen(true);
  };

  const handleEditQuestion = (question) => {
    setCurrentQuestion(question);
    setModalOpen(true);
  };

  const handleDeleteQuestion = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (confirmDelete) {
      onUpdateQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleSaveQuestion = (text, timeLimit) => {
    if (currentQuestion.id) {
      // Var olan soruyu güncelle
      onUpdateQuestions(
        questions.map((q) => (q.id === currentQuestion.id ? { ...q, text, timeLimit } : q))
      );
    } else {
      // Yeni soru ekle
      const newId = questions.length ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
      onUpdateQuestions([...questions, { id: newId, text, timeLimit }]);
    }
    setModalOpen(false);
    setCurrentQuestion(null);
  };

  return (
    <div className="manage-questions">
      <h2>Manage Questions for Package {packageId}</h2>
      <button className="add-question-button" onClick={handleAddQuestion}>+ Add Question</button>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Time Limit (minutes)</th> {/* Dakika cinsinden gösterim */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td>{question.id}</td>
              <td>{question.text}</td>
              <td>{Math.round(question.timeLimit / 60)}</td> {/* Saniyeyi dakikaya çeviriyoruz */}
              <td>
                <button className="edit-button" onClick={() => handleEditQuestion(question)}>✏️</button>
                <button className="delete-button" onClick={() => handleDeleteQuestion(question.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <QuestionModal
          question={currentQuestion}
          onSave={handleSaveQuestion}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

const QuestionModal = ({ question, onSave, onClose }) => {
  const [text, setText] = useState(question?.text || "");
  const [timeLimit, setTimeLimit] = useState(question?.timeLimit ? question.timeLimit / 60 : 0); // Dakika cinsinden

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(text, timeLimit * 60); // Dakikayı saniyeye çevirip kaydediyoruz
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{question?.id ? "Edit Question" : "Add Question"}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Question</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Time Limit (minutes)</label> {/* Dakika cinsinden giriş */}
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              required
              min="0"
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ManageQuestions;
