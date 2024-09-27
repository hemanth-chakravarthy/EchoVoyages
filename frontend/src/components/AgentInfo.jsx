import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const AgentInfo = () => {
    const [bookings, setBookings] = useState([]);
    const [editing, setEditing] = useState(false);
    const [agent, setAgent] = useState({});
    const token = localStorage.getItem('token');
    const id = token ? jwtDecode(token).id : null;
    const AgentID = id;
    const navigate = useNavigate();
    const specializations = ['luxury', 'adventure', 'business', 'family', 'other'];
  
    const totalAmountEarned = bookings.reduce((total, booking) => total + booking.price, 0);

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/agency/${id}`);
                setAgent(response.data);
            } catch (error) {
                alert('Error fetching agent details');
                console.log(error);
            }
        };
        const fetchBookingsData = async () => {
            try {
                const bookingsResponse = await axios.get(`http://localhost:5000/packages/agents/${AgentID}`);
                console.log("Bookings Response:", bookingsResponse.data); // Log the response for debugging
                setBookings(bookingsResponse.data);
            } catch (error) {
                console.error("Error fetching bookings:", error.response ? error.response.data : error);
            }
            
        };
        fetchAgent();
        fetchBookingsData();
    }, [id]);

    const handleEditToggle = () => {
        setEditing(!editing);
    };
    const handleLogout = () => {
        localStorage.removeItem('token');

        navigate('/');
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAgent((prevAgent) => ({
            ...prevAgent,
            [name]: value,
        }));
    };

    const handleUpdateAgent = async () => {
        try {
            await axios.put(`http://localhost:5000/agency/${id}`, agent);
            alert('Agent details updated successfully');
            navigate('/AgentProfilePage'); 
        } catch (error) {
            alert('Error occurred while updating agent details');
            console.log(error);
        }
    };

    return (
        <div className="update-container">
            <h1 className="title">Edit Agent Details</h1>
            <div className='agent-profile'>
                <div className="agent-image-logout">
                    <div className='image-edit-div'>
                        <img 
                            src={'./images/empty-profile-pic.png'} 
                            alt="Profile" 
                            style={{ width: '150px', height: '150px', borderRadius: '50%' }} 
                        />
                    </div>
                    <p className="logout-btn" onClick={handleLogout}>Logout</p>
                </div>
                <div className="agent-info">
                    <div className="heading-profile">
                        <h2>Agent Profile</h2>
                        <button className="edit-profile-btn" onClick={handleEditToggle}>
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                    {editing ? (
                        <div className="update-card">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={agent.name || ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={agent.username || ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={agent.contactInfo?.phone || ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                            <label>Email</label>
                            <input
                                type="text"
                                name="email"
                                value={agent.contactInfo?.email || ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                            <label>Specialization</label>
                            <select
                                name="specialization"
                                value={agent.specialization || ''}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select Specialization</option>
                                {specializations.map((option) => (
                                    <option key={option} value={option}>
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                value={agent.bio || ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                            <button onClick={handleUpdateAgent} className="save-button">
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <div>
                        {['name', 'username', 'specialization', 'bio'].map((field) => (
                            <div className="profile-item" key={field}>
                                <span className="label">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>
                                <span>{agent[field] || 'N/A'}</span>
                            </div>
                        ))}

                        {/* Phone and Email from agent.contactInfo */}
                        <div className="profile-item">
                            <span className="label">Phone:</span>
                            <span>{agent.contactInfo?.phone || 'N/A'}</span>
                        </div>
                        <div className="profile-item">
                            <span className="label">Email:</span>
                            <span>{agent.contactInfo?.email || 'N/A'}</span>
                        </div>

                    </div>
                    )}
                </div>
            </div>
            <div className="booking-list">
            <h2>Previous Bookings</h2>
            <div className="statistics">
                <p><strong>Total Amount Earned:</strong> Rs. {totalAmountEarned}</p>
            </div>
            <div className="bookings-grid">
                {bookings ? (
                    bookings.map((booking) => (
                        <div key={booking._id} className="booking">
                            <h3>Package: {booking.name || 'N/A'}</h3>
                            <p><strong>Total Price:</strong> Rs. {booking.price}</p>
                            <p><strong>Booking Date:</strong> {new Date(booking.availableDates).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No previous bookings available.</p>
                )}
            </div>
        </div>
        </div>
    );
};

export default AgentInfo;
