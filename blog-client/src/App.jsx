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
import { AuthProvider } from "./context/AuthContext";
import UpdateProfile from "./pages/dashbaord/user/UpdateProfile";
import AddBlogPost from "./components/posts/AddBlogPost";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="w-full mx-auto max-w-screen-xl px-4 md:px-8 py-6 mt-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/posts/add" element={<AddBlogPost />} />
              <Route path="/posts/:postId" element={<PostDetail />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
