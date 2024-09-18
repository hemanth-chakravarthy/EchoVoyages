import React from 'react';
import { Link } from 'react-router-dom';

const bookingsTable = ({ bookings }) => {
    return (
        <div>
            <div className='head1'>bookings List:</div>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking, index) => (
                        <tr key={booking._id}>
                            <td>{index + 1}</td>
                            <td>{booking._id}</td>
                            <td>{booking.bookingDate}</td>
                            <td>{booking.totalPrice}</td>
                            <td>
                                <div>
                                    <Link to={`/admin/bookings/${booking._id}`}>Show</Link>
                                    <Link to={`/admin/bookings/edit/${booking._id}`}>Update</Link>
                                    <Link to={`/admin/bookings/delete/${booking._id}`}>Delete</Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default bookingsTable;
