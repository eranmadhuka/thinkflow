import { RouterProvider } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { router } from "./routes/index";
import React, { useContext } from "react";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AppWithNotifications />
    </AuthProvider>
  );
}

const AppWithNotifications = () => {
  const { user } = useContext(AuthContext);

  return (
    <NotificationProvider userId={user?.id}>
      <RouterProvider router={router} />
    </NotificationProvider>
  );
};

export default App;
