import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import AuthForm from './components/AuthForm';
import Dashboard from './pages/Dashboard';

const App = () => {
    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HeroSection />} />
                <Route path="/auth" element={<AuthForm />} />
                <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/auth" />} />
            </Routes>
        </Router>
    );
};

export default App;
