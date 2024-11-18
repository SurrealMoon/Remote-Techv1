import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './SeeVideos.css';
import useVideoStore from '../stores/useUploadedVideosStore';

const SeeVideos = () => {
  const { id } = useParams(); // URL'den gelen id
  const { videos, fetchVideos, error } = useVideoStore();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState({}); // Videolar için yorumlar

  useEffect(() => {
    const loadVideos = async () => {
      if (!id) {
        console.error('No ID found in URL');
        return;
      }
      console.log('Fetching videos for ID:', id);
      setLoading(true);

      // Yeni bir mülakat yüklenmeden önce mevcut videoları geçici olarak sıfırla
      useVideoStore.setState({ videos: [] });

      try {
        await fetchVideos(id); // Backend'den videoları çek
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.warn('No videos found for this interview.');
        } else {
          console.error('Error fetching videos:', err);
        }
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, [id, fetchVideos]);

  // Yorum kaydetme
  const handleSaveComment = async (videoId) => {
    const comment = comments[videoId]?.trim();
    if (!comment) {
      alert('Lütfen bir yorum girin!');
      return;
    }
  
    try {
      // API isteği
      const response = await axios.put(
        `/uploaded-videos/${videoId}/comment`,
        { comment }
      );
      alert('Yorum başarıyla kaydedildi!');
      console.log('Yorum Kaydedildi:', response.data);
  
      // Yorum backend'e kaydedildikten sonra state'i güncelle
      const updatedVideo = response.data.video; // Backend'den gelen güncellenmiş video
      useVideoStore.setState((prev) => ({
        videos: prev.videos.map((video) =>
          video._id === updatedVideo._id ? { ...video, comment: updatedVideo.comment } : video
        ),
      }));
  
      // Yorum alanını sıfırla
      setComments((prev) => ({ ...prev, [videoId]: '' }));
    } catch (error) {
      console.error('Yorum kaydedilirken bir hata oluştu:', error);
      alert('Yorum kaydedilirken bir hata oluştu.');
    }
  };
  
  

  // Video silme
  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Bu videoyu silmek istediğinizden emin misiniz?')) {
      try {
        // API isteği
        await axios.delete(`/api/uploaded-videos/${videoId}`);
        alert('Video başarıyla silindi!');
  
        // Frontend'deki state'i güncelle
        useVideoStore.setState((prev) => ({
          videos: prev.videos.filter((video) => video._id !== videoId),
        }));
      } catch (error) {
        console.error('Video silinirken bir hata oluştu:', error);
        alert('Video silinirken bir hata oluştu.');
      }
    }
  };
  

  if (!Array.isArray(videos)) {
    console.error('Videos is not an array:', videos);
    return <p>Videolar yüklenirken bir hata oluştu.</p>;
  }

  return (
    <div className="see-videos-page">
    <h1>Videolar</h1>
    {loading && <p>Videolar yükleniyor...</p>}
    {error && <p className="see-videos-error">{error}</p>}
    {!loading && videos.length > 0 ? (
      <div className="see-videos-list">
        {videos.map((video, index) => (
          <div key={video._id} className="see-videos-item">
            <h3>Video {index + 1}</h3>
            <video controls>
              <source src={video.videoUrl} type="video/webm" />
              Tarayıcınız video etiketini desteklemiyor.
            </video>
            {video.candidate && (
              <div className="see-videos-candidate-info">
                <p>
                  <strong>Ad:</strong> {video.candidate.firstName}{' '}
                  {video.candidate.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {video.candidate.email}
                </p>
                <p>
                  <strong>Telefon:</strong> {video.candidate.phone}
                </p>
              </div>
            )}
            {/* Yorumları Gösterme Alanı */}
            {video.comment && (
              <div className="see-videos-comment">
                <h4>Yorum:</h4>
                <p>{video.comment}</p>
              </div>
            )}
            {/* Yorum Alanı */}
            <textarea
              className="comment-area"
              placeholder="Bu video hakkında yorum yapın..."
              value={comments[video._id] || ''}
              onChange={(e) =>
                setComments((prev) => ({
                  ...prev,
                  [video._id]: e.target.value,
                }))
              }
            />
            <button
              className="save-comment-btn"
              onClick={() => handleSaveComment(video._id)}
            >
              Yorumu Kaydet
            </button>
            {/* Sil Butonu */}
            <button
              className="delete-video-btn"
              onClick={() => handleDeleteVideo(video._id)}
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    ) : (
      !loading && <p className="see-videos-no-videos">Kayıtlı video bulunamadı.</p>
    )}
  </div>
  
  );
};

export default SeeVideos;