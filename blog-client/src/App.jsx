import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Register from "./pages/Register";
import Profile from "./pages/dashbaord/Profile";
import Feed from "./pages/Feed";
import PostDetail from "./components/posts/PostDetail";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import UpdateProfile from "./pages/dashbaord/user/UpdateProfile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
