import React from "react";
import { useAuth } from "./context/AuthContext";

const Profile = () => {
    const { user, loading, login, logout } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {user ? (
                <div>
                    <h1>Welcome, {user.name}!</h1>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <div>
                    <h1>Please log in</h1>
                    <button onClick={login}>Login with Google</button>
                </div>
            )}
        </div>
    );
};

export default Profile;