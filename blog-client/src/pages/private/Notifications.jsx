import React from "react";
import { useNotifications } from "../../context/NotificationContext";

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, loading } =
    useNotifications();

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-0 text-center mt-12">
        <p className="text-lg text-gray-600">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <header>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Notifications
          </h2>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Stay updated with your latest alerts
          </p>
        </header>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-200"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map((notif, index) => (
            <li
              key={notif.id}
              className={`p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                notif.read
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white text-gray-800 font-semibold"
              } transition-colors duration-200`}
            >
              <div className="flex flex-col">
                <span className="text-sm sm:text-base">{notif.message}</span>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(notif.createdAt).toLocaleString()} -{" "}
                  {notif.read ? "Read" : "Unread"}
                </span>
              </div>
              {!notif.read && (
                <button
                  onClick={() => markAsRead(index)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-200"
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-lg sm:text-xl">No notifications yet</p>
          <p className="text-sm mt-2">You're all caught up!</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
