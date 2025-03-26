import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Notification = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => {
        console.log("Creating SockJS connection to ws://localhost:8080/ws");
        return new SockJS("http://localhost:8080/ws");
      },
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP Debug:", str),
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");
      client.subscribe(`/user/${userId}/notifications`, (message) => {
        console.log("Received message:", message.body); // Log raw message
        const receivedNotification = JSON.parse(message.body);
        console.log("Parsed notification:", receivedNotification); // Log parsed object
        setNotifications((prev) => [
          receivedNotification.message,
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

    console.log("Activating STOMP client...");
    client.activate();

    return () => {
      console.log("Deactivating STOMP client...");
      client.deactivate();
    };
  }, [userId]);

  return (
    <div className="fixed top-16 right-4 w-80 bg-white shadow-lg rounded-lg p-4 z-50">
      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
      {notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications.map((msg, index) => (
            <li key={index} className="p-2 bg-gray-100 rounded-md text-sm">
              {msg}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No new notifications</p>
      )}
    </div>
  );
};

export default Notification;
