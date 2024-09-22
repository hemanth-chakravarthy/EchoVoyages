import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/tables.css'

const ReviewsTable = ({ reviews }) => {
    return (
        <div>
            <h2>Reviews List</h2>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>User</th>
                        <th>Package</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review, index) => (
                        <tr key={review._id}>
                            <td>{index + 1}</td>
                            <td>{review.customerName}</td>
                            <td>{review.packageName}</td>
                            <td>{review.rating}</td>
                            <td>{review.comment}</td>
                            <td>{new Date(review.date).toLocaleDateString()}</td>
                            <td>{review.status}</td>
                            <td>
                                <div className='linksPacks'>
                                    <Link className='links' to={`/admin/reviews/edit/${review._id}`}>Edit</Link>
                                    <Link className='links' to={`/admin/reviews/delete/${review._id}`}>Delete</Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewsTable;
