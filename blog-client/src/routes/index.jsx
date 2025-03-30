import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import CommonLayout from "../components/layout/CommonLayout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Public components
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import PrivacyPolicy from "../pages/public/PrivacyPolicy";

// Private components
import Feed from "../pages/private/Feed";
import Profile from "../pages/private/Profile";
import PostDetail from "../components/posts/PostDetail";
import UpdateProfile from "../pages/private/UpdateProfile";
import AddBlogPost from "../components/posts/AddBlogPost";
import SavedPosts from "../pages/private/SavedPosts";
import PeopleList from "../pages/private/PeopleList";
import EditPost from "../components/posts/EditPost";
import FriendsList from "../pages/private/FriendsList";
import Notifications from "../pages/private/Notifications";
import TermsOfService from "../pages/public/TermsOfService";
import About from "../pages/public/About";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/about", element: <About /> },
      { path: "/privacy", element: <PrivacyPolicy /> },
      { path: "/terms", element: <TermsOfService /> },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/feed", element: <Feed /> },
          { path: "/saved-posts", element: <SavedPosts /> },
          { path: "/friends", element: <FriendsList /> },
          { path: "/peoples", element: <PeopleList /> },
          { path: "/notifications", element: <Notifications /> },
          { path: "/profile", element: <Profile /> },
          { path: "/profile/:id", element: <Profile /> },
          { path: "/update-profile", element: <UpdateProfile /> },
          { path: "/posts/add", element: <AddBlogPost /> },
          { path: "/posts/:postId", element: <PostDetail /> },
          { path: "/posts/:postId/edit", element: <EditPost /> },
        ],
      },
      {
        element: <CommonLayout />,
        children: [],
      },
    ],
  },
]);
