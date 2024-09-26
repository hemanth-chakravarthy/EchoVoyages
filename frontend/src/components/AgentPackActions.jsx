import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AgentPackActions = () => {
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState('pending'); // Package status
    const [bookings, setBookings] = useState([]); // Store bookings for this package
    const { id } = useParams(); // Get package ID from URL

    // Fetch package details only
    const handleOpenModal = async () => {
        setShowModal(true); // Show modal regardless of bookings
        try {
            const packageResponse = await axios.get(`http://localhost:5000/packages/${id}`);
            const { name, price, description, isActive } = packageResponse.data;
            setName(name);
            setPrice(price);
            setDescription(description);
            setIsActive(isActive);

            // Conditionally fetch bookings only if the package is active
            if (isActive !== 'pending') {
                const bookingResponse = await axios.get(`http://localhost:5000/bookings/pack/${id}`);
                setBookings(bookingResponse.data); // Set the fetched bookings
            }
        } catch (error) {
            console.error('Error fetching package details or bookings', error);
            setMessage('Error fetching package details or bookings');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                name,
                price,
                description,
                isActive, // Include isActive status in the update
            };

            const response = await axios.put(`http://localhost:5000/packages/${id}`, updatedData);
            setMessage(response.data.message);
            setShowModal(false); // Close modal after update
        } catch (error) {
            console.error(error);
            setMessage('Error updating the package');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/packages/${id}`);
            setMessage(response.data.message);
        } catch (error) {
            console.error(error);
            setMessage('Error deleting the package');
        }
    };

    // Handle booking status update
    const handleBookingStatusChange = async (bookingId, newStatus) => {
        try {
            const response = await axios.put(`http://localhost:5000/bookings/${bookingId}`, { status: newStatus });
            // Update the specific booking's status in the local state
            setBookings((prevBookings) =>
                prevBookings.map((booking) =>
                    booking._id === bookingId ? { ...booking, status: newStatus } : booking
                )
            );
            setMessage(`Booking status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating booking status', error);
            setMessage('Error updating booking status');
        }
    };

    return (
        <div>
            <button onClick={handleOpenModal}>Update Package</button>
            <button onClick={handleDelete}>Delete Package</button>
            {message && <p>{message}</p>}

            {/* Modal for updating the package */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Update Package</h2>
                        <form onSubmit={handleUpdate}>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Price:
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </label>
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                        </form>

                        {/* Only render booking details if there are bookings */}
                        {bookings.length > 0 ? (
                            <>
                                <h3>People Who Want to Book:</h3>
                                <ul>
                                    {bookings.map((booking) => (
                                        <li key={booking._id}>
                                            <p>Customer: {booking.customerName}</p>
                                            <p>Status: {booking.status}</p>
                                            <label>
                                                Change Status:
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) =>
                                                        handleBookingStatusChange(booking._id, e.target.value)
                                                    }
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="canceled">Canceled</option>
                                                </select>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p>No bookings yet.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Optional modal styles */}
            <style>{`
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 400px;
                    max-width: 90%;
                }
                label {
                    display: block;
                    margin-bottom: 10px;
                }
                input, textarea {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 20px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                button {
                    margin-right: 10px;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    background-color: #007bff;
                    color: white;
                    cursor: pointer;
                }
                button[type="button"] {
                    background-color: #6c757d;
                }
            `}</style>
        </div>
    );
};

export default AgentPackActions;
