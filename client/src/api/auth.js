import axios from 'axios';

const API_URL = 'http://localhost:5005/auth';

export const login = async ({ email, parola }) => {
    const response = await axios.post(`${API_URL}/login`, { email, parola });
    return response.data;
};

export const register = async ({ email, parola, nume, prenume }) => {
    const response = await axios.post(`${API_URL}/register`, { email, parola, nume, prenume });
    return response.data;
};

// Helper function to add Authorization header
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};
