import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const decodeToken = (jwtToken) => {
        if(!jwtToken) return null;
        try{
            const payload = JSON.parse(atob(jwtToken.split('.')[1]));
            return {id: payload.id, username: payload.username};
        } catch (error) {
            console.error('Error decoding token: ', error);
            return null
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if(storedToken){
            const decodedUser = decodeToken(storedToken);
            if(decodedUser){
                setToken(storedToken);
                setUser(decodedUser);

                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
            } else {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
                delete axios.defaults.headers.common['Authorization'];
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try{
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {username, password});
            const {token: newToken, user: userData} = response.data;
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);

            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return true;
        } catch (error) {
            console.error('Login error: ', error.response?.data || error.message);
            throw error;
        }
    };

    const register = async (username, password) => {
        try{
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {username, password});
            const {token: newToken, user: userData} = response.data;
            
            console.log('Response: ', response)
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);

            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return true;
        } catch (error) {
            console.error('Registration error: ', error.response?.data || error.message);
            throw error;
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    }

    const authContextValue = {
        token,
        user,
        loading,
        isLoggedIn: !!token,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value = {authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
