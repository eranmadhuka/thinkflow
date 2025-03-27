import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Camera } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import UserImg from "../../assets/images/user.png";

const UpdateProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [status, setStatus] = useState(user?.status || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.picture || "");
  const navigate = useNavigate();

  // Status options with emojis
  const statusOptions = [
    { value: "", label: "Select Status", emoji: "🤔" },
    { value: "Single", label: "Single", emoji: "💔" },
    { value: "In a Relationship", label: "In a Relationship", emoji: "❤️" },
    { value: "Married", label: "Married", emoji: "💍" },
    { value: "Complicated", label: "Complicated", emoji: "🤷‍♂️" },
    { value: "Prefer Not to Say", label: "Prefer Not to Say", emoji: "🤐" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let pictureUrl = user?.picture || "";

      // Upload new profile picture to Firebase if selected
      if (profilePicture) {
        const storageRef = ref(storage, `images/profile-pictures/${user.id}`);
        await uploadBytes(storageRef, profilePicture);
        pictureUrl = await getDownloadURL(storageRef);
      }

      // Update user profile in the backend
      const updatedUser = {
        name,
        bio,
        status,
        picture: pictureUrl,
      };

      const response = await axios.put(
        `http://localhost:8080/user/profile/${user.id}`,
        updatedUser,
        { withCredentials: true }
      );

      // Update user in the AuthContext
      setUser(response.data);
      alert("Profile updated successfully!");
      navigate(`/profile/${user.id}`);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <header>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Update Profile
          </h2>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Customize your personal information
          </p>
        </header>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden"
      >
        {/* Cover Photo */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center -mt-16 sm:-mt-20 px-4">
          <div className="relative">
            <img
              src={user.picture ? user.picture : UserImg}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover shadow-sm"
            />
            <label
              htmlFor="profilePicture"
              className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 cursor-pointer transition-colors duration-200"
            >
              <Camera size={18} />
              <input
                type="file"
                id="profilePicture"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Form Fields */}
        <div className="px-4 sm:px-6 py-6 space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Bio Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
              placeholder="Tell us about yourself"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.emoji} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 text-sm font-medium text-white rounded-md transition-colors duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
