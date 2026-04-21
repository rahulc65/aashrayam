import { useState, useRef } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImageSelect, initialImage = null, disabled = false }) => {
  const [preview, setPreview] = useState(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB.');
      return;
    }

    setUploading(true);

    try {
      // Create FileReader to generate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setPreview(dataUrl);
        onImageSelect(file, dataUrl); // Pass both file and preview
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error processing image:', err);
      alert('Error processing image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect(null, null);
  };

  return (
    <div className="image-upload">
      {!preview ? (
        <div
          className={`image-upload__dropzone ${isDragging ? 'image-upload__dropzone--active' : ''} ${disabled ? 'image-upload__dropzone--disabled' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="image-upload__input"
            disabled={disabled || uploading}
            aria-label="Upload image"
          />

          <div className="image-upload__content">
            <svg className="image-upload__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>

            <div className="image-upload__text">
              <p className="image-upload__title">
                {isDragging ? 'Drop your image here' : 'Drag and drop your image here'}
              </p>
              <p className="image-upload__subtitle">or click to browse from your device</p>
            </div>

            <p className="image-upload__hint">Supported formats: JPG, PNG, GIF, WebP • Max size: 5MB</p>

            {uploading && (
              <div className="image-upload__progress">
                <div className="progress-spinner"></div>
                <span>Processing image...</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="image-upload__preview-wrapper">
          <div className="image-upload__preview">
            <img src={preview} alt="Preview" className="image-upload__preview-img" />
            <div className="image-upload__preview-overlay">
              <button
                type="button"
                className="image-upload__preview-btn image-upload__preview-btn--change"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
                title="Change image"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Change
              </button>
              <button
                type="button"
                className="image-upload__preview-btn image-upload__preview-btn--remove"
                onClick={handleRemoveImage}
                disabled={disabled || uploading}
                title="Remove image"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          </div>
          <p className="image-upload__preview-info">Image selected and ready to upload</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="image-upload__input"
            style={{ display: 'none' }}
            disabled={disabled || uploading}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
