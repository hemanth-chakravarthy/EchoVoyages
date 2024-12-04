import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => navigate("/AgentHome")}
                className="btn btn-primary"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReq;
