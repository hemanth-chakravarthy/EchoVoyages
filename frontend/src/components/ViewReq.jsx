import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ViewReq = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [requestDetails, setRequestDetails] = useState(null);
  const [status, setStatus] = useState(""); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      alert("Invalid request ID.");
      return;
    }

    const fetchRequestDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/requests/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.data) {
          
          console.log(requestDetails)
          setRequestDetails(data.data);
          setStatus(data.data.status);
        } else {
          alert("Request not found!");
        }
      } catch (error) {
        console.error("Error fetching request details:", error);
        alert("Error fetching request details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);


  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: requestDetails._id,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setStatus(newStatus);

        if (newStatus === "approved") {
          await addRequestToBookings();
        } else {
          navigate("/AgentHome");
        }

        alert("Status updated successfully.");
      } else {
        const errorData = await response.json();
        alert(`Failed to update status: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating the status.");
    }
  };

  const addRequestToBookings = async () => {
    try {
      const response = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: requestDetails.customerName,
          customerId: requestDetails.customerId,
          packageName: requestDetails.packageName,
          packageId: requestDetails.packageId,
          guideName: requestDetails.guideName || "",
          guideId: requestDetails.guideId || null,
          totalPrice: requestDetails.price,
          status: "confirmed",
        }),
      });

      if (response.ok) {
        alert("Request successfully added to bookings.");
        navigate("/AgentHome");
      } else {
        const errorData = await response.json();
        alert(`Failed to add to bookings: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding to bookings:", error);
      alert("An error occurred while adding to bookings.");
    }
  };

  if (isLoading) {
    return <p>Loading request details...</p>;
  }

  if (!requestDetails) {
    return <p>No request details found.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Request Details</h1>

      <div className="mb-4">
        <strong>Request ID: </strong>{requestDetails._id}
      </div>
      <div className="mb-4">
        <strong>Customer Name: </strong>{requestDetails.customerName}
      </div>
      <div className="mb-4">
        <strong>Package Name: </strong>{requestDetails.packageName}
      </div>
      <div className="mb-4">
        <strong>Price: </strong>Rs. {requestDetails.price}
      </div>
      <div className="mb-4">
        <strong>Duration: </strong>{requestDetails.duration} days
      </div>
      <div className="mb-4">
        <strong>Requested Date: </strong>{new Date(requestDetails.requestDate).toLocaleDateString()}
      </div>
      <div className="mb-4">
        <strong>Status: </strong>{status}
      </div>

      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium mb-2">
          Change Status:
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate("/AgentHome")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ViewReq;
