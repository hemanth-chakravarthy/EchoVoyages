import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ViewReq = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [requestDetails, setRequestDetails] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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
          // First check if there's an existing booking for this request
          const bookingUpdated = await updateExistingBooking();

          // If no existing booking was found, create a new one
          if (!bookingUpdated) {
            await addRequestToBookings();
          }

          setModalMessage("Request approved and booking status updated to confirmed.");
        } else {
          setModalMessage("Status updated successfully.");
        }

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

  // Function to update existing booking if one exists
  const updateExistingBooking = async () => {
    try {
      // Check if there's an existing booking for this customer and package
      const response = await fetch(`http://localhost:5000/bookings/cust/${requestDetails.customerId}`);

      if (response.ok) {
        const bookings = await response.json();

        // Find a booking that matches this package
        const matchingBooking = bookings.find(
          booking => booking.packageId === requestDetails.packageId && booking.status === "pending"
        );

        if (matchingBooking) {
          // Update the existing booking to confirmed status
          const updateResponse = await fetch(`http://localhost:5000/bookings/${matchingBooking._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "confirmed",
              totalPrice: requestDetails.price // Update price if it changed in the request
            }),
          });

          if (updateResponse.ok) {
            console.log("Existing booking updated to confirmed status");
            return true; // Return true to indicate a booking was updated
          }
        }
      }

      return false; // Return false if no booking was updated
    } catch (error) {
      console.error("Error updating existing booking:", error);
      return false;
    }
  };

  const addRequestToBookings = async () => {
    try {
      // Check if a booking already exists for this customer and package
      const checkResponse = await fetch(`http://localhost:5000/bookings/cust/${requestDetails.customerId}`);

      if (checkResponse.ok) {
        const existingBookings = await checkResponse.json();

        // Check if there's already a booking for this package
        const existingBooking = existingBookings.find(
          booking => booking.packageId === requestDetails.packageId
        );

        if (existingBooking) {
          // If a booking already exists, update its status to confirmed
          const updateResponse = await fetch(`http://localhost:5000/bookings/${existingBooking._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "confirmed",
              totalPrice: requestDetails.price // Update price if it changed in the request
            }),
          });

          if (updateResponse.ok) {
            console.log("Existing booking updated to confirmed status");
            setModalMessage("Existing booking updated to confirmed status.");
            setShowModal(true);
          } else {
            console.error("Failed to update existing booking status");
          }
          return;
        }
      }

      // If no booking exists, create a new one
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
          status: "confirmed", // Set status to confirmed immediately
        }),
      });

      if (response.ok) {
        setModalMessage("Request successfully added to bookings with confirmed status.");
        setShowModal(true);
      } else {
        const errorData = await response.json();
        setModalMessage(`Failed to add to bookings: ${errorData.message}`);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error adding to bookings:", error);
      setModalMessage("An error occurred while adding to bookings.");
      setShowModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#4169E1] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col bg-white"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0, 0, 0) 1px, transparent 0)`,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0',
        backgroundColor: 'rgba(255, 255, 255, 0.97)'
      }}
    >
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-[#1a365d]">EchoVoyages</span>
            </div>
            <div className="flex items-center space-x-4">
              {[
                { to: "/AgentHome", text: "Home" },
                { to: "/createPackage", text: "Create Package" },
                { to: "/AgentProfilePage", text: "Profile" }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-2 rounded-full text-[#2d3748] hover:bg-[#4169E1]/10 hover:text-[#4169E1] transition-all duration-300"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-grow container mx-auto px-4 py-12 relative z-10"
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-8">
            <h1 className="text-4xl font-bold text-[#1a365d] tracking-tight mb-8">
              Request Details
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {[
                  { label: "Request ID", value: requestDetails._id },
                  { label: "Customer Name", value: requestDetails.customerName },
                  { label: "Package Name", value: requestDetails.packageName }
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-lg shadow p-6 border border-gray-100"
                  >
                    <p className="text-[#1a365d] font-medium mb-2">{item.label}</p>
                    <p className="text-[#2d3748]">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-6">
                {[
                  { label: "Price", value: `Rs. ${requestDetails.price}` },
                  { label: "Duration", value: `${requestDetails.duration} days` },
                  {
                    label: "Requested Date",
                    value: new Date(requestDetails.requestDate).toLocaleDateString()
                  }
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-lg shadow p-6 border border-gray-100"
                  >
                    <p className="text-[#1a365d] font-medium mb-2">{item.label}</p>
                    <p className="text-[#2d3748]">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-lg shadow p-6 border border-gray-100"
              >
                <p className="text-[#1a365d] font-medium mb-2">Current Status</p>
                <p className="text-[#2d3748]">{status}</p>
              </motion.div>

              <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                <label className="text-[#1a365d] font-medium mb-4 block">
                  Change Status
                </label>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full bg-gray-50 text-black px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20 transition-all duration-300"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/AgentHome")}
                className="px-8 py-3 bg-[#00072D] text-white font-medium rounded-full hover:bg-[#1a365d] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Back to Home
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.main>

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-[#1a365d] mb-4">Notification</h2>
            <p className="text-[#2d3748] mb-6">{modalMessage}</p>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-[#4169E1] text-white font-medium rounded-full hover:bg-[#1a365d] transition-all duration-300"
                onClick={() => setShowModal(false)}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ViewReq;
