import React, { useState, useEffect } from "react";
import "./ManageQuestionPackage.css";
import ManageQuestions from './ManageQuestions'; // Soruları yönetecek bileşeni dahil ediyoruz

const ManageQuestionPackage = () => {
  const [questionPackages, setQuestionPackages] = useState(() => {
    const savedPackages = localStorage.getItem("questionPackages");
    return savedPackages ? JSON.parse(savedPackages) : [];
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null); // Seçilen soru paketi

  const handleAddPackage = () => {
    setCurrentPackage({ id: null, name: "", count: 0, questions: [] });
    setModalOpen(true);
  };

  const handleEditPackage = (pkg) => {
    setCurrentPackage(pkg);
    setModalOpen(true);
  };

  const handleDeletePackage = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this package?");
    if (confirmDelete) {
      const updatedPackages = questionPackages.filter((pkg) => pkg.id !== id);
      setQuestionPackages(updatedPackages);
      localStorage.setItem("questionPackages", JSON.stringify(updatedPackages));
    }
  };

  const handleSave = (name, count) => {
    if (currentPackage && currentPackage.id !== null) {
      const updatedPackages = questionPackages.map(pkg =>
        pkg.id === currentPackage.id ? { ...pkg, name, count } : pkg
      );
      setQuestionPackages(updatedPackages);
      localStorage.setItem("questionPackages", JSON.stringify(updatedPackages));
    } else {
      const newId = questionPackages.length ? Math.max(...questionPackages.map(pkg => pkg.id)) + 1 : 1;
      const newPackage = { id: newId, name, count, questions: [] };
      const updatedPackages = [...questionPackages, newPackage];
      setQuestionPackages(updatedPackages);
      localStorage.setItem("questionPackages", JSON.stringify(updatedPackages));
    }
    setModalOpen(false);
    setCurrentPackage(null);
  };

  const handleManageQuestions = (pkg) => {
    setSelectedPackage(pkg); // Seçilen soru paketi
  };

  const handleUpdateQuestions = (questions) => {
    const updatedPackages = questionPackages.map(pkg =>
      pkg.id === selectedPackage.id ? { ...pkg, questions, count: questions.length } : pkg
    );
    setQuestionPackages(updatedPackages);
    localStorage.setItem("questionPackages", JSON.stringify(updatedPackages));
    setSelectedPackage(null); // Soru düzenleme işlemi bittikten sonra paketi temizliyoruz
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentPackage(null);
  };

  return (
    <div className="manage-question-package">
      <div className="header">
        <h2>Manage Question Package</h2>
        <button className="add-package-button" onClick={handleAddPackage}>+ Add Package</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Package Name</th>
            <th>Question Count</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questionPackages.map((pkg) => (
            <tr key={pkg.id}>
              <td>{pkg.id}</td>
              <td>{pkg.name}</td>
              <td>{pkg.count}</td>
              <td>
                <button className="edit-button" onClick={() => handleEditPackage(pkg)}>✏️</button>
                <button className="delete-button" onClick={() => handleDeletePackage(pkg.id)}>🗑️</button>
                <button className="manage-questions-button" onClick={() => handleManageQuestions(pkg)}>Manage Questions</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <PackageModal
          package={currentPackage}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}

      {selectedPackage && (
        <ManageQuestions
          packageId={selectedPackage.id}
          questions={selectedPackage.questions || []}
          onUpdateQuestions={handleUpdateQuestions}
        />
      )}
    </div>
  );
};

const PackageModal = ({ package: currentPackage, onSave, onClose }) => {
  const [name, setName] = useState(currentPackage?.name || "");
  const [count, setCount] = useState(currentPackage?.count || 0);

  useEffect(() => {
    setName(currentPackage?.name || "");
    setCount(currentPackage?.count || 0);
  }, [currentPackage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(name, count);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{currentPackage?.id ? "Edit Package" : "Add Package"}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Package Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Question Count</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              required
              readOnly
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ManageQuestionPackage;
