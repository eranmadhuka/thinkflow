import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext"; // Import AuthContext
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase";

const UpdateProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.picture || "");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file)); // Show preview of the selected image
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
        picture: pictureUrl,
      };

      const response = await axios.put(
        `http://localhost:8080/user/profile/${user.id}`,
        updatedUser,
        { withCredentials: true }
      );

      // Update user in the AuthContext
      setUser(response.data); // Ensure setUser is defined
      alert("Profile updated successfully!");
      // Redirect to the profile page
      navigate(`/profile/${user.id}`); // Use navigate to redirect
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          {previewImage && (
            <img
              src={previewImage}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full mb-2"
            />
          )}
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
