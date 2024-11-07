import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import '../assets/css/updateEntity.css';

const CustomerInfo = () => {
    const [bookings, setBookings] = useState([]);
    const [customer, setCustomer] = useState({});
    const [editing, setEditing] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const token = localStorage.getItem('token');
    const id = token ? jwtDecode(token).id : null;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/customers/${id}`);
                setCustomer(response.data);
            } catch (error) {
                alert('Error fetching customer details');
                console.log(error);
            }
        };

        const fetchBookingsData = async () => {
            try {
                const bookingsResponse = await axios.get(`http://localhost:5000/bookings/cust/${id}`);
                setBookings(bookingsResponse.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        if (id) {
            fetchCustomer();
            fetchBookingsData();
        }
    }, [id]);

    const validateForm = () => {
        let formErrors = {};

        if (!/^[a-zA-Z0-9._]+$/.test(customer.username)) {
            formErrors.username = 'Username should only contain letters, numbers, underscores, and dots.';
        }

        if (!/^[a-zA-Z\s]+$/.test(customer.name)) {
            formErrors.name = 'Name should only contain letters and spaces.';
        }

        if (!/^\d{10}$/.test(customer.phoneNumber)) {
            formErrors.phoneNumber = 'Phone number should be a 10-digit number.';
        }

        if (!/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(customer.email)) {
            formErrors.email = 'Email is not valid.';
        }

        if (changePassword) {
            if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(newPassword)) {
                formErrors.newPassword = 'Password must be at least 6 characters long, include a number, a special character, and an uppercase letter.';
            }
            if (newPassword !== confirmPassword) {
                formErrors.confirmPassword = 'New password and confirmation password do not match.';
            }
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleEditToggle = () => setEditing(!editing);
    const handlePasswordToggle = () => setChangePassword(!changePassword);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prevCustomer) => ({ ...prevCustomer, [name]: value }));
    };

    const handleUpdateCustomer = async () => {
        // if (!validateForm()) return;

        try {
            await axios.put(`http://localhost:5000/customers/${id}`, customer);
            alert('Customer details updated successfully');
            setEditing(false);
            navigate('/custProfilePage');
        } catch (error) {
            alert('Error occurred while updating customer details');
            console.log(error);
        }
    };

    const handleUpdatePassword = async () => {
        if (!validateForm()) return;

        try {
            await axios.put(`http://localhost:5000/customers/${id}/update-password`, {
                currentPassword,
                newPassword,
            });
            alert('Password updated successfully');
            setChangePassword(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert('Incorrect current password.');
            } else {
                alert('Error updating password. Please try again later.');
            }
            console.log(error);
        }
    };

    return (
        <div className="update-container">
            <h1 className="title">Edit Customer Details</h1>
            <div className="customer-profile">
                <div className="customer-image-logout">
                    <img 
                        src={'./images/empty-profile-pic.png'} 
                        alt="Profile" 
                        style={{ width: '150px', height: '150px', borderRadius: '50%' }} 
                    />
                    <p className="logout-btn" onClick={handleLogout}>Logout</p>
                </div>
                <div className="customer-info">
                    <div className="heading-profile">
                        <h2>Customer Profile</h2>
                        <button className="edit-profile-btn" onClick={handleEditToggle}>
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
                        <button className="edit-profile-btn" onClick={handlePasswordToggle}>
                            {changePassword ? 'Cancel' : 'Change Password'}
                        </button>
                    </div>

                    {editing ? (
                        <div className="update-card">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={customer.Name || ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                            {errors.name && <p className="error-message">{errors.name}</p>}
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={customer.username || ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                            {errors.username && <p className="error-message">{errors.username}</p>}
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phno"
                                value={customer.phno || ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                            {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
                            <label>Email</label>
                            <input
                                type="text"
                                name="gmail"
                                value={customer.gmail || ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                            {errors.email && <p className="error-message">{errors.email}</p>}
                            <button onClick={handleUpdateCustomer} className="save-button">
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <div>
                            {['Name', 'username', 'phno', 'gmail'].map((field) => (
                                <div className="profile-item" key={field}>
                                    <span className="label">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>
                                    <span>{customer[field] || 'N/A'}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {changePassword && (
                        <div className="update-card">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input-field"
                            />
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input-field"
                            />
                            {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field"
                            />
                            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                            <button onClick={handleUpdatePassword} className="save-button">
                                Update Password
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="booking-list">
                <h2>Previous Bookings</h2>
                <div className="bookings-grid">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div key={booking._id} className="booking">
                                <h3>Package: {booking.packageName || 'N/A'}</h3>
                                <p><strong>Guide Name:</strong> {booking.guideName || 'N/A'}</p>
                                <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                                <p><strong>Status:</strong> {booking.status}</p>
                                <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
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

export default CustomerInfo;
