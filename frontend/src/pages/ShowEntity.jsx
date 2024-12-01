import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

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
    <div className="entity-container">
      <BackButton className="back-button" />
      <h1>
        {entityType === "customers"
          ? "Customer Details"
          : entityType === "packages"
          ? "Package Details"
          : entityType === "guides"
          ? "Guide Details"
          : "Details"}
      </h1>
      <div className="entity-card">
        {entityType === "customers" && (
          <>
            <div className="entity-row">
              <span>ID: </span>
              <span>{entity._id}</span>
            </div>
            <div className="entity-row">
              <span>Name: </span>
              <span>{entity.Name}</span>
            </div>
            <div className="entity-row">
              <span>Username: </span>
              <span>{entity.username}</span>
            </div>
            <div className="entity-row">
              <span>Gmail: </span>
              <span>{entity.gmail}</span>
            </div>
          </>
        )}
        {entityType === "packages" && (
          <>
            <div className="entity-row">
              <span>ID: </span>
              <span>{entity._id}</span>
            </div>
            <div className="entity-row">
              <span>Package Name: </span>
              <span>{entity.name}</span>
            </div>
            <div className="entity-row">
              <span>Description: </span>
              <span>{entity.description}</span>
            </div>
            <div className="entity-row">
              <span>Price: </span>
              <span>{entity.price}</span>
            </div>
          </>
        )}
        {entityType === "guides" && (
          <>
            <div className="entity-row">
              <span>ID: </span>
              <span>{entity._id}</span>
            </div>
            <div className="entity-row">
              <span>Name: </span>
              <span>{entity.name}</span>
            </div>
            <div className="entity-row">
              <span>Availability: </span>
              <span>{entity.availability}</span>
            </div>
            <div className="entity-row">
              <span>Location: </span>
              <span>{entity.location}</span>
            </div>
          </>
        )}
        {entityType === "bookings" && (
          <>
            <div className="entity-row">
              <span>ID: </span>
              <span>{entity._id}</span>
            </div>
            <div className="entity-row">
              <span>Customer Name: </span>
              <span>{entity.customerName}</span>
            </div>
            <div className="entity-row">
              <span>Package Name: </span>
              <span>{entity.packageName}</span>
            </div>
            <div className="entity-row">
              <span>Date: </span>
              <span>{entity.bookingDate}</span>
            </div>
            <div className="entity-row">
              <span>Price: </span>
              <span>{entity.totalPrice}</span>
            </div>
          </>
        )}
        {entityType === "agency" && (
          <>
            <div className="entity-row">
              <span>ID: </span>
              <span>{entity._id}</span>
            </div>
            <div className="entity-row">
              <span>Name: </span>
              <span>{entity.name}</span>
            </div>
            <div className="entity-row">
              <span>Email: </span>
              <span>{entity.contactInfo?.email}</span>
            </div>
            <div className="entity-row">
              <span>Phone: </span>
              <span>{entity.contactInfo?.phone}</span>
            </div>
            <div className="entity-row">
              <span>Bio: </span>
              <span>{entity.bio}</span>
            </div>
            <div className="entity-row">
              <span>Specialization: </span>
              <span>{entity.specialization}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShowEntity;
