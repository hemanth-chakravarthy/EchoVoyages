import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import '../styles/GuideProfilePage.css'
const GuideProfilePage = () => {
    const guideId = jwtDecode(localStorage.getItem('token')).id; 
    const [guide, setGuide] = useState(null);
    const [reviews, setReviews] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false); 
    const [updatedGuide, setUpdatedGuide] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGuideDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/guides/${guideId}`);
                setGuide(response.data);
                setUpdatedGuide(response.data); 
                setLoading(false);
            } catch (error) {
                console.error("Error fetching guide details:", error);
                setLoading(false);
            }
        };

        const fetchReviewsAndCalculateRating = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/reviews/guides/${guideId}`);
                const reviewsData = response.data.review;
                setReviews(reviewsData);

                if (reviewsData.length > 0) {
                    const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
                    const averageRating = totalRating / reviewsData.length;

                    await axios.put(`http://localhost:5000/guides/${guideId}`, {
                        ...updatedGuide,
                        ratings: {
                            averageRating: averageRating.toFixed(1),
                            numberOfReviews: reviewsData.length,
                        },
                    });

                    setGuide((prevGuide) => ({
                        ...prevGuide,
                        ratings: {
                            averageRating: averageRating.toFixed(1),
                            numberOfReviews: reviewsData.length,
                        },
                    }));
                }
            } catch (error) {
                console.error("Error fetching reviews and calculating rating:", error);
            }
        };

        fetchGuideDetails();
        fetchReviewsAndCalculateRating();
    }, [guideId]);

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "languages") {
            const languagesArray = value.split(',').map(lang => lang.trim());
            setUpdatedGuide({
                ...updatedGuide,
                languages: languagesArray,
            });
        } else {
            setUpdatedGuide({
                ...updatedGuide,
                [name]: value,
            });
        }
    };

    const handleNestedChange = (e, parentKey) => {
        const { name, value } = e.target;
        setUpdatedGuide({
            ...updatedGuide,
            [parentKey]: {
                ...updatedGuide[parentKey],
                [name]: value,
            },
        });
    };

    const handleAvailabilityDateChange = (index, field, value) => {
        const updatedDates = [...updatedGuide.availableDates];
        updatedDates[index] = { ...updatedDates[index], [field]: value };
        setUpdatedGuide({
            ...updatedGuide,
            availableDates: updatedDates,
        });
    };

    const handleAddDateRange = () => {
        setUpdatedGuide({
            ...updatedGuide,
            availableDates: [...updatedGuide.availableDates, { startDate: '', endDate: '' }],
        });
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`http://localhost:5000/guides/${guideId}`, updatedGuide);
            alert('Guide details updated successfully');
            setGuide(updatedGuide);
            setEditing(false);
            navigate('/GuideProfilePage');
        } catch (error) {
            console.error('Error updating guide details:', error);
            alert('Error occurred while saving guide details');
        }
    };

    const handleCancel = () => {
        setUpdatedGuide(guide);
        setEditing(false);
    };

    if (loading) {
        return <p>Loading guide details...</p>;
    }

    if (!guide) {
        return <p>Guide not found!</p>;
    }

    return (
        <div className="guide-profile-container">
            <nav className="navbar">
        <ul className="navbar-links">
          
            <Link to={'/guideHome'} className="navbar-link">Guide Home</Link>
            <Link to={`/GuideProfilePage`} className="navbar-link">Profile Page</Link>

        </ul>
      </nav>
            <h1 className="guide-profile-heading">Guide Profile</h1>

            <div className="guide-bio">
                <h2>{editing ? (
                    <input
                        type="text"
                        name="name"
                        className="input-field"
                        value={updatedGuide.name}
                        onChange={handleChange}
                    />
                ) : (
                    guide.name
                )}</h2>
                <p><strong>Username:</strong> {guide.username}</p>
                <p><strong>Experience:</strong> {editing ? (
                    <input
                        type="number"
                        name="experience"
                        className="input-field"
                        value={updatedGuide.experience}
                        onChange={handleChange}
                    />
                ) : (
                    `${guide.experience} years`
                )}</p>
                <p><strong>Languages Spoken:</strong> {editing ? (
                    <input
                        type="text"
                        name="languages"
                        className="input-field"
                        value={updatedGuide.languages.join(', ')}
                        onChange={handleChange}
                    />
                ) : (
                    guide.languages.join(', ')
                )}</p>
                <p><strong>Location:</strong> {editing ? (
                    <input
                        type="text"
                        name="location"
                        className="input-field"
                        value={updatedGuide.location}
                        onChange={handleChange}
                    />
                ) : (
                    guide.location || 'N/A'
                )}</p>
            </div>

            <div className="guide-availability">
                <h3>Availability & Packages</h3>
                {editing ? (
                    <>
                        {updatedGuide.availableDates.map((dateRange, index) => (
                            <div key={index} className="date-range">
                                <label>Start Date:</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={dateRange.startDate}
                                    onChange={(e) =>
                                        handleAvailabilityDateChange(index, 'startDate', e.target.value)
                                    }
                                />
                                <label>End Date:</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={dateRange.endDate}
                                    onChange={(e) =>
                                        handleAvailabilityDateChange(index, 'endDate', e.target.value)
                                    }
                                />
                            </div>
                        ))}
                        <button className="add-date-range-btn" onClick={handleAddDateRange}>Add Date Range</button>
                    </>
                ) : (
                    guide.availableDates && guide.availableDates.length > 0 ? (
                        <ul>
                            {guide.availableDates.map((dateRange, index) => (
                                <li key={index}>
                                    <strong>From:</strong> {new Date(dateRange.startDate).toLocaleDateString()}
                                    <strong> To:</strong> {new Date(dateRange.endDate).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No available dates provided</p>
                    )
                )}
            </div>

            <div className="guide-ratings">
                <h3>Ratings</h3>
                <p><strong>Average Rating:</strong> {guide.ratings.averageRating} / 5</p>
                <p><strong>Number of Reviews:</strong> {guide.ratings.numberOfReviews}</p>
            </div>

            <div className="guide-contact">
                <h3>Contact Information</h3>
                <p><strong>Phone:</strong> {editing ? (
                    <input
                        type="text"
                        name="phone"
                        className="input-field"
                        value={updatedGuide.contact.phone}
                        onChange={(e) => handleNestedChange(e, 'contact')}
                    />
                ) : (
                    guide.contact.phone
                )}</p>
                <p><strong>Email:</strong> {editing ? (
                    <input
                        type="email"
                        name="email"
                        className="input-field"
                        value={updatedGuide.contact.email}
                        onChange={(e) => handleNestedChange(e, 'contact')}
                    />
                ) : (
                    guide.contact.email
                )}</p>
            </div>

            <div className="edit-save-buttons">
                {editing ? (
                    <>
                        <button className="save-button" onClick={handleSaveChanges}>
                            Save Changes
                        </button>
                        <button className="cancel-button" onClick={handleCancel}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <button className="edit-button" onClick={handleEditToggle}>
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default GuideProfilePage;
