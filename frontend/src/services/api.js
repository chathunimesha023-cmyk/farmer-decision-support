import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach Authorization header if token is present
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Expired token or unauthorized
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/home') {
                localStorage.removeItem('token');
                localStorage.removeItem('Farmer-ID');
                localStorage.removeItem('userId');
                localStorage.removeItem('userName');
            }
        }
        return Promise.reject(error);
    }
);

export default API;
