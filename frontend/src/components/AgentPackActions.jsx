import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const AgentPackActions = () => {
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const {id} = useParams();

    // Fetch package details when modal opens (optional, if you want to pre-fill fields)
    const handleOpenModal = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/packages/${id}`);
            const { name, price, description } = response.data;
            setName(name);
            setPrice(price);
            setDescription(description);
            setShowModal(true); // Show modal after fetching data
        } catch (error) {
            console.error('Error fetching package details', error);
            setMessage('Error fetching package details');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        try {
            const updatedData = {
                name,
                price,
                description,
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
