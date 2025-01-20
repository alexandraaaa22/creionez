import axios from 'axios';
import { getAuthHeaders } from './auth';

const API_URL = 'http://localhost:5005';

// Get all materii
export const getAllMaterii = async () => {
  console.log('Materii Sent to API'); // Debug the payload
  try {
      const response = await axios.get(`${API_URL}/materii`, {
          headers: getAuthHeaders(),
      });
      console.log('client::protected::API Response:', response.data); // Debug the response
      return response.data;
  } catch (err) {
      console.error('API Error:', err.response?.data || err.message); // Log error details
      throw err;
  }
};

// Get a single materie by ID
export const getMaterieById = async (id) => {
    const response = await axios.get(`${API_URL}/materie/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

// Create a new materie
export const createMaterie = async (materieData) => {

    console.log('Materie Data Sent to API:', materieData); // Debug the payload
    try {
        const response = await axios.post(`${API_URL}/materie`, materieData, {
            headers: getAuthHeaders(),
        });
        console.log('client::protected::API Response:', response.data); // Debug the response
        return response.data;
    } catch (err) {
        console.error('API Error:', err.response?.data || err.message); // Log error details
        throw err;
    }
};

// Update a materie by ID
export const updateMaterie = async (id, materieData) => {
    const response = await axios.put(`${API_URL}/materie/${id}`, materieData, { headers: getAuthHeaders() });
    return response.data;
};

// Delete a materie by ID
export const deleteMaterie = async (id) => {
    const response = await axios.delete(`${API_URL}/materie/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

// Get a single student by ID
export const getStudentById = async (id) => {
    const response = await axios.get(`${API_URL}/student/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

// Create a new notita
export const createNotita = async (notitaData) => {
    console.log('Submitting Notita to API:', notitaData); // Debug log

    try {
        const response = await axios.post(`${API_URL}/notita`, notitaData, {
            headers: getAuthHeaders(),
        });
        console.log('client::protected::API Response:', response.data); // Debug the response
        return response.data;
    } catch (err) {
        console.error('API Error:', err.response?.data || err.message); // Log error details
        throw err;
    }
};

export const getAllNotite = async (materieId) => {

    try {
        const response = await axios.get(`${API_URL}/notite/${materieId}`, {
            headers: getAuthHeaders(),
        });
        console.log('client::protected::API Response:', response.data); // Debug the response
        return response.data;
    } catch (err) {
        console.error('API Error:', err.response?.data || err.message); // Log error details
        throw err;
    }
};

export const deleteNotita = async (notitaId) => {
    const response = await axios.delete(`${API_URL}/notita/${notitaId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
};

export const updateNotita = async (notitaId, updatedNotita) => {

  console.log('updateNotita protected API:', notitaId, updatedNotita); // Debug log

  try {
      const response = await axios.put(`${API_URL}/notita/${notitaId}`,
          { notita: updatedNotita },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      console.log('client::protected::API Response:', response.data); // Debug the response
      return response.data;
  } catch (err) {
      console.error('API Error:', err.response?.data || err.message); // Log error details
      throw err;
  }
};
