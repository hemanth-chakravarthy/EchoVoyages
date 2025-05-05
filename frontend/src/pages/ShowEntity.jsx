/** @format */

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import apiUrl from "../utils/api.js";

const ShowEntity = () => {
  const [entity, setEntity] = useState({});
  const { id, entityType } = useParams();

  useEffect(() => {
    axios
      .get(`${apiUrl}/admin/${entityType}/${id}`)
      .then((res) => {
        setEntity(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, entityType]);

  const renderEntityRows = () => {
    switch (entityType) {
      case "customers":
        return (
          <>
            <EntityRow label="ID" value={entity._id} />
            <EntityRow label="Name" value={entity.Name} />
            <EntityRow label="Username" value={entity.username} />
            <EntityRow label="Gmail" value={entity.gmail} />
          </>
        );
      case "packages":
        return (
          <>
            <EntityRow label="ID" value={entity._id} />
            <EntityRow label="Package Name" value={entity.name} />
            <EntityRow label="Description" value={entity.description} />
            <EntityRow label="Price" value={entity.price} />
          </>
        );
      case "guides":
        return (
          <>
            <EntityRow label="ID" value={entity._id} />
            <EntityRow label="Name" value={entity.name} />
            <EntityRow label="Availability" value={entity.availability} />
            <EntityRow label="Location" value={entity.location} />
          </>
        );
      case "bookings":
        return (
          <>
            <EntityRow label="ID" value={entity._id} />
            <EntityRow label="Customer Name" value={entity.customerName} />
            <EntityRow label="Package Name" value={entity.packageName} />
            <EntityRow label="Date" value={entity.bookingDate} />
            <EntityRow label="Price" value={entity.totalPrice} />
          </>
        );
      case "agency":
        return (
          <>
            <EntityRow label="ID" value={entity._id} />
            <EntityRow label="Name" value={entity.name} />
            <EntityRow label="Email" value={entity.contactInfo?.email} />
            <EntityRow label="Phone" value={entity.contactInfo?.phone} />
            <EntityRow label="Bio" value={entity.bio} />
            <EntityRow label="Specialization" value={entity.specialization} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <BackButton className="mb-6 inline-flex items-center px-4 py-2 rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out" />
        <div className="bg-card shadow-xl rounded-lg overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <h1 className="text-2xl font-bold text-primary-foreground">
              {entityType === "customers"
                ? "Customer Details"
                : entityType === "packages"
                  ? "Package Details"
                  : entityType === "guides"
                    ? "Guide Details"
                    : entityType === "bookings"
                      ? "Booking Details"
                      : entityType === "agency"
                        ? "Agency Details"
                        : "Details"}
            </h1>
          </div>
          <div className="px-4 py-3 space-y-2">{renderEntityRows()}</div>
        </div>
      </div>
    </div>
  );
};

const EntityRow = ({ label, value }) => (
  <div className="entity-row flex py-2 transition duration-150 ease-in-out hover:bg-muted">
    <span className="font-medium text-muted-foreground w-1/3">{label}:</span>
    <span className="text-foreground w-2/3">{value}</span>
  </div>
);

export default ShowEntity;
