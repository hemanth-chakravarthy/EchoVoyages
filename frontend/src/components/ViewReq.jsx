import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ViewReq = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [requestDetails, setRequestDetails] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [modalMessage, setModalMessage] = useState(""); // Message for modal

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
        } 

        // Show modal with success message
        setModalMessage("Status updated successfully.");
        setShowModal(true);
      } else {
        const errorData = await response.json();
        setModalMessage(`Failed to update status: ${errorData.message}`);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setModalMessage("An error occurred while updating the status.");
      setShowModal(true);
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
        setModalMessage("Request successfully added to bookings.");
        setShowModal(true); 
      } else {
        const errorData = await response.json();
        setModalMessage(`Failed to add to bookings: ${errorData.message}`);
        setShowModal(true); // Show error modal
      }
    } catch (error) {
      console.error("Error adding to bookings:", error);
      setModalMessage("An error occurred while adding to bookings.");
      setShowModal(true); // Show error modal
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

      {/* Modal for Success/Error Messages */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowModal(false)} // Close modal if user clicks outside
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-1/3"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h2 className="text-xl font-bold">Notification</h2>
            <p>{modalMessage}</p>
            <div className="flex justify-end mt-4">
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReq;
