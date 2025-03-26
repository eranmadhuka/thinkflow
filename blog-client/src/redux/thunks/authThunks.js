// src/redux/thunks/authThunks.js
import { loginStart, loginSuccess, loginFailure, logout } from '../slices/authSlice';
import { AuthService } from '../../services/AuthService';

export const handleOAuthLogin = (code) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const { user, access_token } = await AuthService.handleOAuthCallback(code);
        dispatch(loginSuccess({ user, token: access_token }));
        localStorage.setItem('authToken', access_token);
    } catch (error) {
        dispatch(loginFailure(error.message));
        throw error;
    }
};

export const initializeAuth = () => async (dispatch) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            // Verify token and get user data
            const user = await verifyToken(token);
            dispatch(setAuthState({ user, token }));
        } catch (error) {
            localStorage.removeItem('authToken');
        }
    }
};

export const handleLogout = () => (dispatch) => {
    localStorage.removeItem('authToken');
    dispatch(logout());
};