import React, { useState, useRef } from "react";

const MediaUpload = ({ onFilesSelected }) => {
  const [images, setImages] = useState([null, null, null]); // Array of 3 possible image slots
  const [video, setVideo] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    // Filter out non-image files
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    // Create a new array with existing images
    const newImages = [...images];

    // Fill in empty slots with new images (up to 3)
    let filesAdded = 0;
    for (let i = 0; i < 3 && filesAdded < imageFiles.length; i++) {
      if (newImages[i] === null) {
        newImages[i] = imageFiles[filesAdded];
        filesAdded++;
      }
    }

    setImages(newImages);
    updateSelectedFiles(newImages, video);
  };

  const handleVideoChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("video/")) {
      alert("Please select a video file.");
      return;
    }

    // Check video size (rough estimate for 30 seconds)
    if (selectedFile.size > 30 * 1024 * 1024) {
      alert("Video must be less than 30 seconds (max 30MB).");
      return;
    }

    setVideo(selectedFile);
    updateSelectedFiles(images, selectedFile);
  };

  const updateSelectedFiles = (currentImages, currentVideo) => {
    const allFiles = [...currentImages.filter((img) => img !== null)];
    if (currentVideo) allFiles.push(currentVideo);
    onFilesSelected(allFiles);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
    updateSelectedFiles(newImages, video);
  };

  const removeVideo = () => {
    setVideo(null);
    updateSelectedFiles(images, null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Images (up to 3)</h3>
        <p className="text-sm text-gray-500">
          First image will be used as the blog post thumbnail
        </p>

        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`border-2 border-dashed rounded-lg p-2 flex flex-col items-center justify-center h-40 ${
                index === 0 ? "border-indigo-500" : "border-gray-300"
              }`}
            >
              {image ? (
                <div className="relative w-full h-full">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-indigo-500 text-white text-xs px-2 py-1 rounded">
                      Thumbnail
                    </span>
                  )}
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center cursor-pointer h-full w-full"
                  onClick={() => imageInputRef.current.click()}
                >
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span className="text-sm text-gray-500 mt-2">
                    {index === 0 ? "Add thumbnail" : `Add image ${index + 1}`}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <input
          type="file"
          ref={imageInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        <button
          type="button"
          onClick={() => imageInputRef.current.click()}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Select Images
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">
          Video (optional, max 30 seconds)
        </h3>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center h-48">
          {video ? (
            <div className="relative w-full h-full">
              <video
                src={URL.createObjectURL(video)}
                controls
                className="w-full h-full object-cover rounded"
              />
              <button
                type="button"
                onClick={removeVideo}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
              <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                {video.name}
              </span>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center cursor-pointer h-full w-full"
              onClick={() => videoInputRef.current.click()}
            >
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
              <span className="text-sm text-gray-500 mt-2">
                Add video (max 30 seconds)
              </span>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={videoInputRef}
          className="hidden"
          accept="video/*"
          onChange={handleVideoChange}
        />

        <button
          type="button"
          onClick={() => videoInputRef.current.click()}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Select Video
        </button>
      </div>
    </div>
  );
};

export default MediaUpload;
