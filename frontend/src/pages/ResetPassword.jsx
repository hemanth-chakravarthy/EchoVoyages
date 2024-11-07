import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { id, token } = useParams();
    
    // Form data state for password
    const [formData, setFormData] = useState({
        password: ''
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
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Submit password in the formData object
        axios.post(`http://localhost:5000/reset-password/${id}/${token}`, { password: formData.password })
            .then(res => {
                if(res.data.status === "success") {
                    navigate('/');
                } else {
                    console.log("Password reset failed:", res.data);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="form-container">
                <h2 className="form-title">Reset Password</h2>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <button type="submit" className="submit-btn">Update</button>
            </form>
        </div>
    );
}

export default ResetPassword;
