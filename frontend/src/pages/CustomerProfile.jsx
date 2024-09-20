import React, { useEffect, useState } from 'react';
import BookingHistory from '../components/BookingHistory';
import Wishlist from '../components/Wishlist';
import Reviews from './Reviews';
import ProfileInfo from './ProfileInfo';
import axios from 'axios';

const CustomerProfile = () => {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // Fetch customer data from the server (replace with your API)
    axios.get(`http://localhost:5000/customer/${id}`) // Replace '123' with dynamic customer ID
      .then(response => setCustomer(response.data))
      .catch(error => console.error('Error fetching customer data:', error));
  }, []);

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Customer Profile</h2>
      <ProfileInfo customer={customer} />
      <BookingHistory bookings={customer.bookingHistory} />
      <Wishlist wishlist={customer.wishlist} />
      <Reviews reviews={customer.reviews} />
    </div>
  );
};

export default CustomerProfile;
