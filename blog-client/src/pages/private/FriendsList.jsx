import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProfileCard from "../../components/ui/ProfileCard";
import { Search, Filter } from "lucide-react";

const FriendsList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");

  const fetchData = useCallback(async () => {
    try {
      // Fetch logged-in user
      const loggedInResponse = await axios.get(
        "http://localhost:8080/user/profile",
        { withCredentials: true }
      );
      const loggedInUserData = loggedInResponse.data;
      setLoggedInUser(loggedInUserData);

      // Fetch all users
      const usersResponse = await axios.get(
        "http://localhost:8080/user/users",
        { withCredentials: true }
      );

      // Filter to only include users the logged-in user is following
      const followingUsers = usersResponse.data.filter((user) =>
        loggedInUserData.following?.includes(user.id)
      );

      setUsers(followingUsers);
      setFilteredUsers(followingUsers);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch following users:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler to update follow status globally
  const handleFollowToggle = (userId, isFollowing) => {
    setLoggedInUser((prev) => ({
      ...prev,
      following: isFollowing
        ? [...(prev.following || []), userId]
        : (prev.following || []).filter((id) => id !== userId),
    }));

    // Update users list: remove user if they are unfollowed
    if (!isFollowing) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  };

  // Search and filter handlers
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterUsers(term, filterOption);
  };

  const handleFilterChange = (e) => {
    const option = e.target.value;
    setFilterOption(option);
    filterUsers(searchTerm, option);
  };

  const filterUsers = (term, filter) => {
    let result = users;

    // Search filter
    if (term) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }

    // Additional filter options (applied to following users)
    switch (filter) {
      case "followers":
        result = result.filter((user) => (user.followers?.length || 0) > 0);
        break;
      case "mutual":
        result = result.filter((user) =>
          user.following?.includes(loggedInUser.id)
        );
        break;
      default:
        // "all" - show all following users
        break;
    }

    setFilteredUsers(result);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-0">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-center">Your Friends</h3>

        <div className="flex justify-center space-x-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search friends by name or email"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <div className="relative">
            <select
              value={filterOption}
              onChange={handleFilterChange}
              className="appearance-none w-40 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Friends</option>
              <option value="followers">With Followers</option>
              <option value="mutual">Mutual Friends</option>
            </select>
            <Filter
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <ProfileCard
              key={user.id}
              user={user}
              loggedInUser={loggedInUser}
              onFollowToggle={handleFollowToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-xl">You're not following anyone yet</p>
        </div>
      )}
    </div>
  );
};

export default FriendsList;
