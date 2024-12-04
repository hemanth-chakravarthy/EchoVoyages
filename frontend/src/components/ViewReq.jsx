import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
          console.log(requestDetails);
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
    return (
      <div className="flex justify-center items-center h-screen bg-base-300">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (!requestDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-300">
        <p className="text-lg text-error">No request details found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">EchoVoyages</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/AgentHome" className="btn btn-ghost">
                Home
              </Link>
            </li>
            <li>
              <Link to="/createPackage" className="btn btn-ghost">
                Create Package
              </Link>
            </li>
            <li>
              <Link to="/AgentProfilePage" className="btn btn-ghost">
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto mt-8">
        <div className="bg-base-100 shadow-xl rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-primary">
              Request Details
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-base-200 p-4 rounded-lg">
                  <strong className="text-primary">Request ID: </strong>
                  <span className="text-base-content">
                    {requestDetails._id}
                  </span>
                </div>
                <div className="bg-base-200 p-4 rounded-lg">
                  <strong className="text-primary">Customer Name: </strong>
                  <span className="text-base-content">
                    {requestDetails.customerName}
                  </span>
                </div>
                <div className="bg-base-200 p-4 rounded-lg">
                  <strong className="text-primary">Package Name: </strong>
                  <span className="text-base-content">
                    {requestDetails.packageName}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-base-200 p-4 rounded-lg">
                  <strong className="text-primary">Price: </strong>
                  <span className="text-base-content">
                    Rs. {requestDetails.price}
                  </span>
                </div>
                <div className="bg-base-200 p-4 rounded-lg">
                  <strong className="text-primary">Duration: </strong>
                  <span className="text-base-content">
                    {requestDetails.duration} days
                  </span>
                </div>
                <div className="bg-base-200 p-4 rounded-lg">
                  <strong className="text-primary">Requested Date: </strong>
                  <span className="text-base-content">
                    {new Date(requestDetails.requestDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-base-200 p-4 rounded-lg">
              <strong className="text-primary">Current Status: </strong>
              <span className="text-base-content">{status}</span>
            </div>

            <div className="mt-6">
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-2 text-primary"
              >
                Change Status:
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="select select-bordered w-full max-w-xs"
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
