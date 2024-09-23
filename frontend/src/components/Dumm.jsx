import React, { useState, useEffect } from 'react';
import { FaPen } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const CustomerInfo = ({ customer, onLogout }) => {
    const [editing, setEditing] = useState(false);
    const [updatedCustomer, setUpdatedCustomer] = useState(customer);
    const [customersss, setCustomer] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const id = jwtDecode(localStorage.getItem('token')).id;
    const navigate = useNavigate();
    const fieldLabels = {
        username: 'Username',
        Name: 'Name',
        phno: 'Phone Number',
        gmail: 'Email',
        gender: 'Gender',
        state: 'State',
        address: 'Address',
    };
    useEffect(() => {
        // Fetch the customer details based on ID
        const fetchCustomer = async () => {
            try {
                const response = await fetch(`http://localhost:5000/customers/${id}`);
                setCustomer(response.data);
            } catch (error) {
                alert('Error fetching customer details');
                console.log(error);
            }
        };

        fetchCustomer();
    }, [id]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: value,
        }));
    };
    const handleUpdateCustomer = async () => {
        try {
            await axios.put(`http://localhost:5000/customers/${id}`, customer);
            alert('Customer details updated successfully');
            navigate('/custProfilePage'); // Redirect to the customers list or profile
        } catch (error) {
            alert('Error occurred while updating customer details');
            console.log(error);
        }
    };
    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedCustomer((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSave = () => {
        console.log('Updated customer:', updatedCustomer);
        setEditing(false);
    };

    const handleLogout = () => {
        setShowLogoutPopup(true);
    };

    const confirmLogout = () => {
        onLogout();
        console.log('User logged out');
        setShowLogoutPopup(false);
    };
    return (
        <div className="customer-profile">
            <div className="customer-image-logout">
                <div className='image-edit-div'>
                    <img 
                        src={profileImage || './images/empty-profile-pic.png'} 
                        alt="Profile" 
                        style={{ width: '150px', height: '150px', borderRadius: '50%' }} 
                    />
                    <label htmlFor="file-upload" className="file-upload-label">
                        <FaPen /> Edit Profile Picture
                    </label>
                    <input 
                        type="file" 
                        id="file-upload" 
                        onChange={handleImageChange} 
                        style={{ display: 'none' }} 
                    />
                </div>
                <p className="logout-btn" onClick={handleLogout}>Logout</p>
            </div>
            <div className="customer-info">
                <div className="heading-profile">
                    <h2>Customer Profile</h2>
                    <button className="edit-profile-btn" onClick={handleEditToggle}>
                        {editing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {editing ? (
                    <div>
                        {Object.keys(fieldLabels).map((field) => (
                            <div className="profile-item" key={field}>
                                <span className="label">{fieldLabels[field]}</span>
                                <input
                                    name={field}
                                    value={updatedCustomer[field] || ''}
                                    onChange={handleChange}
                                    className="profile-input"
                                />
                            </div>
                        ))}
                        <button className="save-profile-btn" onClick={handleUpdateCustomer}>
                            Save
                        </button>
                    </div>
                ) : (
                    <div>
                        {Object.keys(fieldLabels).map((field) => (
                            <div className="profile-item" key={field}>
                                <span className="label">{fieldLabels[field]}</span>
                                
                            </div>
                        ))}
                    </div>
                )}

                {showLogoutPopup && (
                    <>
                        <div className="backdrop" onClick={() => setShowLogoutPopup(false)}></div>
                        <div className="logout-popup">
                            <p>Are you sure you want to logout?</p>
                            <div className="button-container">
                                <button className="yes-button" onClick={confirmLogout}>Yes</button>
                                <button className="no-button" onClick={() => setShowLogoutPopup(false)}>No</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerInfo;
