import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Camera } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase";

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
    { value: "", label: "Select Status", emoji: "🤔" }, // Default empty option
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
      let pictureUrl = user.picture;

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

      console.log(updatedUser);

      const response = await axios.put(
        `http://localhost:8080/user/profile/${user.id}`,
        updatedUser,
        { withCredentials: true }
      );

      // Update user in the AuthContext
      setUser(response.data);
      alert("Profile updated successfully!");
      // Redirect to the profile page
      navigate(`/profile/${user.id}`);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          {/* Cover Photo */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            {/* You can add a cover photo upload functionality here if needed */}
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center -mt-16 mb-6">
            <div className="relative">
              <img
                src={previewImage || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <label
                htmlFor="profilePicture"
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 cursor-pointer"
              >
                <Camera size={16} />
                <input
                  type="file"
                  id="profilePicture"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="px-6 pb-8 space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Bio Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Tell us about yourself"
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
