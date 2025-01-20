import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { login, register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', nume: '', prenume: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        console.log('Form submitted:', formData); // Debug log

        try {
          if (isRegister) {
            console.log('Registering user...');
            await register(formData);
            alert('Registration successful! Please log in.');
            setIsRegister(false);
          } else {
            console.log('Logging in user...');
            const response = await login(formData);
            localStorage.setItem('token', response.token);
            navigate('/dashboard'); // Redirect to dashboard
          }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-4">
                <Col md={6}>
                    <h2 className="text-center">{isRegister ? 'Register' : 'Login'}</h2>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        {isRegister && (
                            <>
                                <Form.Group controlId="formNume">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nume"
                                        placeholder="Enter your first name"
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPrenume">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="prenume"
                                        placeholder="Enter your last name"
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </>
                        )}
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="parola"
                                placeholder="Password"
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3 w-100">
                            {isRegister ? 'Register' : 'Login'}
                        </Button>
                    </Form>
                    <p className="text-center mt-3">
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <Button
                            variant="link"
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {isRegister ? 'Login' : 'Register'}
                        </Button>
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default AuthForm;
