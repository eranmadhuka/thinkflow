import { RouterProvider } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { router } from "./routes/index";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <NotificationProviderWrapper />
    </AuthProvider>
  );
}

const NotificationProviderWrapper = () => {
  const { user } = useAuth();
  return (
    <NotificationProvider userId={user?.id}>
      <RouterProvider router={router} />
    </NotificationProvider>
  );
};

export default App;
