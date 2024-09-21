import React, { useState } from 'react';

const CreatePackage = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        location: '',
        itinerary: '',
        highlights: '',
        availableDates: '',
        maxGroupSize: ''
    });

    const [images, setImages] = useState([]);

    // Handling form data changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handling image file selection
    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    // Handling form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formPayload = new FormData();
        // Append all form fields to FormData
        Object.keys(formData).forEach((key) => {
            formPayload.append(key, formData[key]);
        });

        // Append images to FormData
        images.forEach((image) => {
            formPayload.append('images', image);
        });

        try {
            const response = await fetch("http://localhost:5000/packages", {
                method: "POST",
                body: formPayload,  // No need to set headers for FormData
            });
            if (response.ok) {
                // Reset form fields and images if successful
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    duration: '',
                    location: '',
                    itinerary: '',
                    highlights: '',
                    availableDates: '',
                    maxGroupSize: ''
                });
                setImages([]);
                console.log("Package created successfully!");
            } else {
                console.log("Failed to create package.");
            }
        } catch (err) {
            console.error("Error creating package:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
                <label>Package Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Duration (Days)</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Itinerary</label>
                <textarea name="itinerary" value={formData.itinerary} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Highlights</label>
                <input type="text" name="highlights" value={formData.highlights} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Available Dates</label>
                <input type="date" name="availableDates" value={formData.availableDates} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Max Group Size</label>
                <input type="number" name="maxGroupSize" value={formData.maxGroupSize} onChange={handleInputChange} required />
            </div>
            <div>
                <label>Images</label>
                <input type="file" name="image" onChange={handleImageChange} multiple required />
            </div>
            <button type="submit">Create Package</button>
        </form>
    );
};

export default CreatePackage;
