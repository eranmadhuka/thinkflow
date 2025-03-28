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
      const loggedInResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        { withCredentials: true }
      );
      const loggedInUserData = loggedInResponse.data;
      setLoggedInUser(loggedInUserData);

      const usersResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/users`,
        { withCredentials: true }
      );

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

  const handleFollowToggle = (userId, isFollowing) => {
    setLoggedInUser((prev) => ({
      ...prev,
      following: isFollowing
        ? [...(prev.following || []), userId]
        : (prev.following || []).filter((id) => id !== userId),
    }));

    if (!isFollowing) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  };

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

    if (term) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }

    switch (filter) {
      case "followers":
        result = result.filter((user) => (user.followers?.length || 0) > 0);
        break;
      case "mutual":
        result = result.filter((user) =>
          user.following?.includes(loggedInUser?.id)
        );
        break;
      default:
        break;
    }

    setFilteredUsers(result);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <header>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Your Friends
          </h2>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Manage your connections
          </p>
        </header>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          <div className="relative">
            <select
              value={filterOption}
              onChange={handleFilterChange}
              className="w-full sm:w-40 pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value="all">All Friends</option>
              <option value="followers">With Followers</option>
              <option value="mutual">Mutual Friends</option>
            </select>
            <Filter
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>
      </div>

      {/* Friends List */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          <p className="text-lg sm:text-xl">You're not following anyone yet</p>
          <p className="text-sm mt-2">
            Start connecting with people to see them here!
          </p>
        </div>
      )}
    </div>
  );
};

export default FriendsList;
