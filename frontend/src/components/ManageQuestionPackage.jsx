import React, { useState, useEffect } from "react";
import useQuestionPackageStore from '../stores/useQuestionPackageStore'; // Zustand store'u içe aktarın
import "./ManageQuestionPackage.css";
import ManageQuestions from './ManageQuestions'; // Soruları yönetecek bileşeni dahil ediyoruz

const ManageQuestionPackage = () => {
  const {
    packages: questionPackages,
    fetchPackages,
    addPackage,
    updatePackage,
    removePackage,
    error
  } = useQuestionPackageStore();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null); // Seçilen soru paketi

  useEffect(() => {
    fetchPackages(); // Component yüklendiğinde paketleri getir
  }, [fetchPackages]);

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
      removePackage(id); // Zustand store'daki silme işlevini çağır
    }
  };

  const handleSave = (name, count) => {
    if (currentPackage && currentPackage.id !== null) {
        // Güncelleme işlemi
        updatePackage(currentPackage.id, { packageName: name, questionCount: count }); // `name` yerine `packageName` olarak değiştirildi
    } else {
        // Yeni paket ekleme işlemi
        addPackage({ packageName: name, questionCount: count, questions: [] }); // `name` yerine `packageName`
    }
    setModalOpen(false);
    setCurrentPackage(null);
};

  const handleManageQuestions = (pkg) => {
    setSelectedPackage(pkg); // `pkg` nesnesinin tamamını seçilen paket olarak atıyoruz
  };
  

  const handleUpdateQuestions = (questions) => {
    const updatedPackage = { ...selectedPackage, questions, count: questions.length };
    updatePackage(selectedPackage.id, updatedPackage); // Soruları güncelle
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
          {questionPackages.map((pkg, index) => (
            <tr key={pkg._id}>
              <td>{index + 1}</td>
              <td>{pkg.packageName}</td>
              <td>{pkg.questionCount}</td>
              <td>
                <button className="edit-button" onClick={() => handleEditPackage(pkg)}>✏️</button>
                <button className="delete-button" onClick={() => handleDeletePackage(pkg._id)}>🗑️</button>
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
        packageId={selectedPackage._id}
        packageName={selectedPackage.packageName} // `packageName` olarak geçildi
        questions={selectedPackage.questions || []}
        onUpdateQuestions={handleUpdateQuestions}
    />
)}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

const PackageModal = ({ package: currentPackage, onSave, onClose }) => {
  const [name, setName] = useState(currentPackage?.name || "");
  const [count, setCount] = useState(currentPackage?.questions.length || 0); // Başlangıç olarak questions.length kullanılıyor

  useEffect(() => {
    setName(currentPackage?.name || "");
    setCount(currentPackage?.questions.length || 0); // Güncel veri geldiğinde count'u güncelle
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
              onChange={(e) => setName(e.target.value)} // Name güncelleniyor
              required
            />
          </div>
          <div>
            <label>Question Count</label>
            <input
              type="number"
              value={count} // Dinamik olarak count güncelleniyor
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
