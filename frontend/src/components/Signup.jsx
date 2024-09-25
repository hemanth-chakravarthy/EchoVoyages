import React, { useState } from 'react';
import './Signup.css'; // Importing the CSS

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
        validateField(name, value); // Validate on input change
    };

    // Validate individual fields
    const validateField = (name, value) => {
        let newErrors = { ...errors };

        switch (name) {
            case 'gmail':
                newErrors.gmail = value.includes('@') ? '' : 'Email must contain "@"';
                break;
            case 'password':
                newErrors.password = value.length >= 6 ? '' : 'Password must be at least 6 characters long';
                break;
            case 'phno':
                newErrors.phno = /^[0-9]*$/.test(value) ? '' : 'Phone number must be numeric';
                break;
            default:
                break;
        }

        setErrors(newErrors);
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
        <form onSubmit={handleSubmit} className="form-container">
            <h2 className="form-title">Sign Up</h2>
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className={errors.username ? 'invalid' : ''}
                />
                {errors.username && <p className="error-message">{errors.username}</p>}
            </div>
            <div className="form-group">
                <label>Name</label>
                <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Phone Number</label>
                <input
                    type="text"
                    name="phno"
                    value={formData.phno}
                    onChange={handleInputChange}
                    required
                    className={errors.phno ? 'invalid' : ''}
                />
                {errors.phno && <p className="error-message">{errors.phno}</p>}
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="gmail"
                    value={formData.gmail}
                    onChange={handleInputChange}
                    required
                    className={errors.gmail ? 'invalid' : ''}
                />
                {errors.gmail && <p className="error-message">{errors.gmail}</p>}
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={errors.password ? 'invalid' : ''}
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
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
            <button type="submit" className="submit-btn">Sign Up</button>
        </form>
    );
};

export default Signup;
