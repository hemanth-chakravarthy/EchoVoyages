import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ViewPendingCustomers from '../components/ViewPendingCustomers';
import axios from 'axios';
import '../styles/GuideHome.css';

const GuideHome = () => {
  const [guide, setGuide] = useState(null);
  const [reviews, setRevDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const guideId = jwtDecode(localStorage.getItem('token')).id;

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reviews/guides/${guideId}`);
        setGuide(response.data.guide);
      } catch (error) {
        console.error('Error fetching guide data:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/reviews/guides/${guideId}`);
        const data = await res.json();
        setRevDetails(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const fetchBookingsData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/bookings/guides/${guideId}`);
        const bookingData = res.data;

        // Count pending, confirmed, and canceled bookings
        const pendingBookings = bookingData.filter(booking => booking.status === 'pending').length;
        const confirmedBookings = bookingData.filter(booking => booking.status === 'confirmed').length;
        const canceledBookings = bookingData.filter(booking => booking.status === 'cancelled').length;

        setBookings(bookingData);
        setPendingCount(pendingBookings);
        setConfirmedCount(confirmedBookings);
        setCanceledCount(canceledBookings);
        setTotalCount(bookingData.length); // Total bookings count
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchReviews();
    fetchGuideData();
    fetchBookingsData();
  }, [guideId]);

  return (
    <div className="guide-home-container">
      <nav className="navbar">
        <ul className="navbar-links">
          <Link to={'/guideHome'} className="navbar-link">Guide Home</Link>
          <Link to={`/GuideProfilePage`} className="navbar-link">Profile Page</Link>
        </ul>
      </nav>
      <div className="statistics-section">
        <h2>Booking Statistics</h2>
        <p><strong>Total Bookings:</strong> {totalCount}</p>
        <p><strong>Pending Bookings:</strong> {pendingCount}</p>
        <p><strong>Confirmed Bookings:</strong> {confirmedCount}</p>
        <p><strong>Cancelled Bookings:</strong> {canceledCount}</p>
      </div>
      <ViewPendingCustomers />

      

      <div className="reviews-section">
        <h2 className="reviews-heading">Reviews</h2>
        {reviews && reviews.length > 0 ? (
          <ul className="reviews-list">
            {reviews.map((review) => (
              <li key={review._id} className="review-item">
                <p>
                  <strong className="review-author">{review.customerName}</strong>: {review.comment} (Rating: <span className="review-rating">{review.rating}</span>)
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-reviews">No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default GuideHome;
