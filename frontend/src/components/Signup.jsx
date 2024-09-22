import React, { useState } from 'react';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        Name: '',
        phno: '',
        gmail: '',
        password: '',
        role: 'customer', // Default role
    });

    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Validation function
    const validateForm = async () => {
        const newErrors = {};

        // Check if email contains '@'
        if (!formData.gmail.includes('@')) {
            newErrors.gmail = 'Email must contain "@"';
        }

        // Check if password is at least 6 characters long
        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

       

        return newErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validationErrors = await validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/customers/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setFormData({
                    username: '',
                    Name: '',
                    phno: '',
                    gmail: '',
                    password: '',
                    role: 'customer'
                });
                setErrors({});
                console.log("Signup successful!");
            } else {
                const data = await response.json();
                console.log(data.error);
                console.log("Signup failed.");
            }
        } catch (err) {
            console.error("Error signing up:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
                {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
            </div>
            <div>
                <label>Name</label>
                <input type="text" name="Name" value={formData.Name} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Phone Number</label>
                <input type="text" name="phno" value={formData.phno} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Email</label>
                <input type="email" name="gmail" value={formData.gmail} onChange={handleInputChange} required />
                {errors.gmail && <p style={{ color: 'red' }}>{errors.gmail}</p>}
            </div>
            <div>
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
            </div>
            <div>
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange} required>
                    <option value="customer">Customer</option>
                    <option value="travel agency">Travel Agency</option>
                    <option value="guide">Guide</option>
                </select>
            </div>
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
