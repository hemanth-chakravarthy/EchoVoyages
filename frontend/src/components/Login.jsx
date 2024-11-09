import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Signup.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // State for admin modal visibility and credentials
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
    const [adminError, setAdminError] = useState('');

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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
                const data = await response.json();
                localStorage.setItem('token', data.token);

                // Redirect based on the role provided in the response
                if (data.role === 'customer') {
                    navigate('/home');
                } else if (data.role === 'agency') {
                    navigate('/AgentHome');
                } else if (data.role === 'guide') {
                    navigate('/guideHome');
                } else {
                    setErrors({ login: 'Unknown user role' });
                }
            } else {
                const data = await response.json();
                setErrors({ login: data.msg || 'Login failed.' });
            }
        } catch (err) {
            console.error("Error logging in:", err);
            setErrors({ login: 'Server error. Please try again later.' });
        }
    };

    // Handle admin login
    const handleAdminLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/customers/adminlogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminCredentials),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setIsAdminModalOpen(false);
                navigate('/admin'); // Navigate to the admin dashboard
            } else {
                setAdminError(data.error || 'Invalid admin credentials.');
            }
        } catch (err) {
            console.error('Error during admin login:', err);
            setAdminError('An error occurred. Please try again.');
        }
    };

    return (
        <div>
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
                
                <button type="submit" className="submit-btn">Log In</button>
            </form>
            <Link to='/forgot-password'>Forgot Password?</Link>

            {/* Admin Login Button */}
            <button className="admin-btn" onClick={() => setIsAdminModalOpen(true)}>Admin Login</button>

            {/* Admin Login Modal */}
            {isAdminModalOpen && (
                <div className="admin-modal">
                    <div className="modal-content">
                        <h2>Admin Login</h2>
                        {adminError && <p className="error-message">{adminError}</p>}
                        <input
                            type="text"
                            placeholder="Admin Username"
                            value={adminCredentials.username}
                            onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Admin Password"
                            value={adminCredentials.password}
                            onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                        />
                        <button onClick={handleAdminLogin}>Login</button>
                        <button onClick={() => setIsAdminModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
