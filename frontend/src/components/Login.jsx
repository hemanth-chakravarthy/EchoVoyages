import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'customer', // Default role
    });
    const navigate = useNavigate();

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

                // Redirect after successful login
                const { role } = formData
                if(role === 'customer'){
                    navigate('/home')
                }else if(role === 'travel agency'){
                    navigate('/AgentHome')
                }else{
                    navigate('/guideHome')
                }
            } else {
                console.log("Login failed.");
            }
        } catch (err) {
            console.error("Error logging in:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange} required>
                    <option value="customer">Customer</option>
                    <option value="travel agency">Travel Agency</option>
                    <option value="guide">Guide</option>
                </select>
            </div>
            <button type="submit">Log In</button>
        </form>
    );
};

export default Login;
