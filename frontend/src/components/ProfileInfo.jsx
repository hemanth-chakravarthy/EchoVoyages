import React from 'react';

const ProfileInfo = ({ customer }) => {
  return (
    <div>
      <h3>Profile Information</h3>
      <p><strong>Username:</strong> {customer.username}</p>
      <p><strong>Name:</strong> {customer.Name}</p>
      <p><strong>Phone:</strong> {customer.phno}</p>
      <p><strong>Email:</strong> {customer.gmail}</p>
    </div>
  );
};

export default ProfileInfo;
