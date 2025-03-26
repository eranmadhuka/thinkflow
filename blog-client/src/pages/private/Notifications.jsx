import React from "react";
import { useNotifications } from "../../context/NotificationContext";

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <button
          onClick={markAllAsRead}
          className="text-sm text-emerald-600 hover:underline"
        >
          Mark all as read
        </button>
      </div>
      {notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications.map((notif, index) => (
            <li
              key={index}
              className={`p-4 rounded-md flex justify-between items-center ${
                notif.read
                  ? "bg-gray-100 text-gray-500"
                  : "bg-gray-50 text-gray-700"
              }`}
            >
              <span>{notif.message}</span>
              {!notif.read && (
                <button
                  onClick={() => markAsRead(index)}
                  className="text-sm text-emerald-600 hover:underline"
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No new notifications</p>
      )}
    </div>
  );
};

export default Notifications;
