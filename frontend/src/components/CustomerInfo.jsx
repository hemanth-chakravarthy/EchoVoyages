import React, { useState } from 'react';
import { FaPen } from 'react-icons/fa';

const CustomerInfo = ({ customer, onLogout }) => {
    const [editing, setEditing] = useState(false);
    const [updatedCustomer, setUpdatedCustomer] = useState(customer);
    const [profileImage, setProfileImage] = useState(null);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const fieldLabels = {
        username: 'Username',
        Name: 'Name',
        phno: 'Phone Number',
        gmail: 'Email',
        gender: 'Gender',
        state: 'State',
        address: 'Address',
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
                                    onChange={handleInputChange}
                                    className="profile-input"
                                />
                            </div>
                        ))}
                        <button className="save-profile-btn" onClick={handleSave}>
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
