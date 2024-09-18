import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ShowEntity = () => {
    const [entity, setEntity] = useState({});
    const { id, entityType } = useParams();

    useEffect(() => {
        axios
            .get(`http://localhost:5000/admin/${entityType}/${id}`)
            .then((res) => {
                setEntity(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id, entityType]);

    return (
        <div>
            <h1>Show</h1>
            <div>
                {entityType === 'customers' && (
                    <>
                        <div>
                            <span>ID: </span>
                            <span>{entity._id}</span>
                        </div>
                        <div>
                            <span>Name: </span>
                            <span>{entity.Name}</span>
                        </div>
                        <div>
                            <span>Username: </span>
                            <span>{entity.username}</span>
                        </div>
                        <div>
                            <span>Gmail: </span>
                            <span>{entity.gmail}</span>
                        </div>
                    </>
                )}
                {entityType === 'packages' && (
                    <>
                        <div>
                            <span>ID: </span>
                            <span>{entity._id}</span>
                        </div>
                        <div>
                            <span>Package Name: </span>
                            <span>{entity.name}</span>
                        </div>
                        <div>
                            <span>Description: </span>
                            <span>{entity.description}</span>
                        </div>
                        <div>
                            <span>Price: </span>
                            <span>{entity.price}</span>
                        </div>
                    </>
                )}
                {entityType === 'guides' && (
                    <>
                        <div>
                            <span>ID: </span>
                            <span>{entity._id}</span>
                        </div>
                        <div>
                            <span>Name: </span>
                            <span>{entity.name}</span>
                        </div>
                        <div>
                            <span>Availability: </span>
                            <span>{entity.availability}</span>
                        </div>
                        <div>
                            <span>Location: </span>
                            <span>{entity.location}</span>
                        </div>
                    </>
                )}
                {entityType === 'bookings' && (
                    <>
                        <div>
                            <span>ID: </span>
                            <span>{entity._id}</span>
                        </div>
                        <div>
                            <span>Date: </span>
                            <span>{entity.bookingDate}</span>
                        </div>
                        <div>
                            <span>Price: </span>
                            <span>{entity.totalPrice}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShowEntity;
