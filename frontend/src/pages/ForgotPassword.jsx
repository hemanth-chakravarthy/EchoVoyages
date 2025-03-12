import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    // Handle input changes
    const [formData, setFormData] = useState({
        gmail: ''
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:5000/forgot-password', {gmail:formData.gmail})
        .then(res => {
            if(res.data.status === "Success") {
                navigate('/login')
               
            }
        }).catch(err => console.log(err))
    }
  return (
    <div>
        <form onSubmit={handleSubmit} className="form-container">
                <h2 className="form-title">Forgot Password</h2>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="gmail"
                        value={formData.gmail}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <button type="submit" className="submit-btn">Send Email</button>
            </form>
    </div>
  )
}

export default ForgotPassword