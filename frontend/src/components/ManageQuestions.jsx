import React, { useState, useEffect } from "react";
import "./ManageQuestions.css";
import useManageQuestionStore from '../stores/useManageQuestionStore';

const ManageQuestions = ({ packageId, packageName, questions: initialQuestions = [] }) => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const {
    addQuestionToPackage,
    updateQuestionInPackage,
    deleteQuestionFromPackage,
    fetchQuestionsFromServer
  } = useManageQuestionStore();

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  // Yeni `fetchQuestions` işlevi
  const fetchQuestions = async () => {
    const fetchedQuestions = await fetchQuestionsFromServer(packageId);
    setQuestions(fetchedQuestions);
  };

  const handleAddQuestion = () => {
    setCurrentQuestion({ id: null, questionText: "", time: 0 });
    setModalOpen(true);
  };

  const handleEditQuestion = (question) => {
    setCurrentQuestion({
      id: question._id,
      questionText: question.questionText,
      time: question.time,
    });
    setModalOpen(true);
  };

  const handleDeleteQuestion = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this question?");
    if (confirmDelete) {
      await deleteQuestionFromPackage(packageId, id);
      fetchQuestions(); // Silinen soru sonrası listeyi güncelle
    }
  };

  const handleSaveQuestion = async (questionText, time) => {
    const questionData = { questionText, time: time * 60 };
    if (currentQuestion.id) {
      await updateQuestionInPackage(packageId, currentQuestion.id, questionData);
    } else {
      await addQuestionToPackage(packageId, questionData);
    }
    setModalOpen(false);
    setCurrentQuestion(null);
    fetchQuestions(); // Yeni eklenen/güncellenen soru sonrası listeyi güncelle
  };

  return (
    <div className="manage-questions">
      <h2>Manage Questions for Package {packageName}</h2>
      <button className="add-question-button" onClick={handleAddQuestion}>+ Add Question</button>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Time Limit (minutes)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={question._id}>
              <td>{index + 1}</td>
              <td>{question.questionText || "Untitled Question"}</td>
              <td>{question.time ? Math.round(question.time / 60) : "-"}</td>
              <td>
                <button className="edit-button" onClick={() => handleEditQuestion(question)}>✎</button>
                <button className="delete-button" onClick={() => handleDeleteQuestion(question._id)}>🗑</button>
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
  const [questionText, setQuestionText] = useState(question?.questionText || "");
  const [time, setTime] = useState(question?.time ? question.time / 60 : 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(questionText, time);
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
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Time Limit (minutes)</label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
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
  