import React, { createContext, useState, useEffect, useContext } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configure Axios to always send credentials (cookies)
  axios.defaults.withCredentials = true;

  // Fetch all notifications from the backend
  const fetchNotifications = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notifications/${userId}`
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      if (error.response?.status === 401) {
        console.error("Unauthorized: Session may have expired.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications when userId changes
  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  // WebSocket setup for real-time updates
  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_API_URL}/ws`, null, {
          transports: ["websocket"], // Ensure WebSocket transport
        }),
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP Debug:", str),
      // Pass session cookie implicitly via SockJS (handled by browser)
    });

    client.onConnect = () => {
      client.subscribe(`/user/${userId}/notifications`, (message) => {
        const receivedNotification = JSON.parse(message.body);
        setNotifications((prev) => {
          if (prev.some((n) => n.id === receivedNotification.id)) return prev;
          return [
            {
              ...receivedNotification,
              read: receivedNotification.read || false,
            },
            ...prev,
          ];
        });
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame.headers?.message, frame.body);
    };

    client.onWebSocketError = (error) => {
      console.error("WebSocket error:", error);
    };

    client.onDisconnect = () => {
      console.log("Disconnected from WebSocket");
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [userId]);

  // Mark a notification as read and sync with backend
  const markAsRead = async (index) => {
    const notification = notifications[index];
    if (!notification.read) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/notifications/read/${
            notification.id
          }`
        );
        setNotifications((prev) =>
          prev.map((notif, i) =>
            i === index ? { ...notif, read: true } : notif
          )
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  // Mark all notifications as read and sync with backend
  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((notif) => !notif.read)
          .map((notif) =>
            axios.post(
              `${import.meta.env.VITE_API_URL}/api/notifications/read/${
                notif.id
              }`
            )
          )
      );
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, markAllAsRead, loading }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
