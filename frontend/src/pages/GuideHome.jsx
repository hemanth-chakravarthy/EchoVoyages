import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ViewPendingCustomers from "../components/ViewPendingCustomers";
import axios from "axios";

const GuideHome = () => {
  const [guide, setGuide] = useState(null);
  const [reviews, setRevDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const guideId = jwtDecode(localStorage.getItem("token")).id;

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/reviews/guides/${guideId}`
        );
        setGuide(response.data.guide);
      } catch (error) {
        console.error("Error fetching guide data:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/reviews/guides/${guideId}`
        );
        const data = await res.json();
        setRevDetails(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchBookingsData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/bookings/guides/${guideId}`
        );
        const bookingData = res.data;

        // Count pending, confirmed, and canceled bookings
        const pendingBookings = bookingData.filter(
          (booking) => booking.status === "pending"
        ).length;
        const confirmedBookings = bookingData.filter(
          (booking) => booking.status === "confirmed"
        ).length;
        const canceledBookings = bookingData.filter(
          (booking) => booking.status === "cancelled"
        ).length;

        setBookings(bookingData);
        setPendingCount(pendingBookings);
        setConfirmedCount(confirmedBookings);
        setCanceledCount(canceledBookings);
        setTotalCount(bookingData.length); // Total bookings count
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchReviews();
    fetchGuideData();
    fetchBookingsData();
  }, [guideId]);

  return (
    <div
      className="p-6"
      style={{
        backgroundColor: "rgba(66, 71, 91, 0.1)", // Custom background color
        minHeight: "100vh",
      }}
    >
      <nav className="mb-6">
        <ul className="flex justify-around  text-white p-4 rounded">
          <Link to={"/guideHome"} className="hover:underline btn btn-primary">
            Guide Home
          </Link>
          <Link to={`/GuideProfilePage`} className="hover:underline btn btn-primary">
            Profile Page
          </Link>
        </ul>
      </nav>
      <div className="flex justify-center items-center flex-col">
      <div className="bg-white shadow-lg text-black rounded p-6"
      style={{ width: "70%" }}>
        <h2 className="text-2xl font-bold mb-4 text-blue-800">
          Booking Statistics
        </h2>
        <p>
          <strong>Total Bookings:</strong> {totalCount}
        </p>
        <p>
          <strong>Pending Bookings:</strong> {pendingCount}
        </p>
        <p>
          <strong>Confirmed Bookings:</strong> {confirmedCount}
        </p>
        <p>
          <strong>Cancelled Bookings:</strong> {canceledCount}
        </p>
      </div>
      <ViewPendingCustomers />

      <div 
      className="mt-6 bg-white shadow-lg rounded p-6 text-black"
      style={{ width: "70%" }}>
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Reviews</h2>
        {reviews && reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li key={review._id} className="mb-4">
                <p>
                  <strong>{review.customerName}</strong>: {review.comment} (
                  Rating: {review.rating})
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No reviews available.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default GuideHome;
