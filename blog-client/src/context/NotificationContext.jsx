// src/context/NotificationContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const NotificationContext = createContext();

export const NotificationProvider = ({ children, userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP Debug:", str),
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");
      client.subscribe(`/user/${userId}/notifications`, (message) => {
        const receivedNotification = JSON.parse(message.body);
        setNotifications((prev) => [
          { ...receivedNotification, read: false }, // Ensure read is set
          ...prev.slice(0, 4),
        ]);
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

  const markAsRead = (index) => {
    setNotifications((prev) =>
      prev.map((notif, i) => (i === index ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
