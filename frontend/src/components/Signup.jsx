import React, { useState } from 'react';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        Name: '',
        phno: '',
        gmail: '',
        password: '',
        

    });

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
                    password: ''
                });
                console.log("Signup successful!");
            } else {
                console.log(response.formData.error);
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
            </div>
            <div>
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
            </div>
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
