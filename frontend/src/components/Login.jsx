import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css'; // Reuse styles

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'customer', // Default role
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Additional validation can be added here if necessary
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.username || !formData.password) {
            setErrors({ login: 'Username and password are required.' });
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/customers/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log("Login successful!");
                setFormData({
                    username: '',
                    password: '',
                    role: 'customer'
                });
                
                const data = await response.json();
                localStorage.setItem('token', data.token);

                // Redirect based on role
                if (formData.role === 'customer') {
                    navigate('/home');
                } else if (formData.role === 'travel agency') {
                    navigate('/AgentHome');
                } else {
                    navigate('/guideHome');
                }
            } else {
                const data = await response.json();
                setErrors({ login: data.error || 'Login failed.' });
            }
        } catch (err) {
            console.error("Error logging in:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h2 className="form-title">Log In</h2>
            {errors.login && <p className="error-message">{errors.login}</p>}
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Role</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                >
                    <option value="customer">Customer</option>
                    <option value="travel agency">Travel Agency</option>
                    <option value="guide">Guide</option>
                </select>
            </div>
            <button type="submit" className="submit-btn">Log In</button>
        </form>
    );
};

export default Login;
