import React, { useEffect, useState } from "react";
import CustomerPackActions from "../components/CustomerPackActions";
import AgentPackActions from "../components/AgentPackActions";
import GuidePackActions from "../components/GuidePackActions";
import ViewPackage from "../components/ViewPackage";
import GuideRequestsList from "../components/GuideRequestsList";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

const ViewPage = () => {
  const [role, setRole] = useState("agent");
  const [loading, setLoading] = useState(true);
  const [packageDetails, setPackageDetails] = useState(null);
  const { id: packageId } = useParams();

  const token = localStorage.getItem("token");

  try {
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
    } else {
      console.log("No token found in localStorage");
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  useEffect(() => {
    const determineUserRole = () => {
      if (!token) {
        console.log("No token found, setting role to guest");
        setRole("guest");
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        // Check the user type from the token (check both userType and role fields)
        const userRole = decoded.userType || decoded.role;
        if (userRole) {
          console.log("User type/role from token:", userRole);

          // Set role based on token's userType or role
          if (userRole === "customer") {
            console.log("Setting role to customer from token");
            setRole("customer");
          } else if (userRole === "guide") {
            console.log("Setting role to guide from token");
            setRole("guide");
          } else if (userRole === "agency" || userRole === "agent") {
            console.log("Setting role to agency from token");
            setRole("agency");
          } else {
            console.log("Unknown user type, defaulting to guest");
            setRole("guest");
          }
        } else {
          console.log("No user type or role in token, trying to determine from API");
          // If neither userType nor role is in token, try to determine from API
          fetchUserRoleFromAPI(decoded.id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setRole("guest");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRoleFromAPI = async (userId) => {
      if (!userId) {
        console.log("No user ID available, setting role to guest");
        setRole("guest");
        setLoading(false);
        return;
      }

      try {
        console.log("Checking user role for ID:", userId);

        // Try to fetch customer data
        try {
          const customerResponse = await axios.get(
            `http://localhost:5000/customers/${userId}`
          );
          console.log("Customer response:", customerResponse.data);
          if (customerResponse.data) {
            console.log("Setting role to customer");
            setRole("customer");
            return;
          }
        } catch (customerError) {
          console.log("Not a customer:", customerError.message);
        }

        // Try to fetch guide data
        try {
          const guideResponse = await axios.get(
            `http://localhost:5000/guides/${userId}`
          );
          console.log("Guide response:", guideResponse.data);
          if (guideResponse.data) {
            console.log("Setting role to guide");
            setRole("guide");
            return;
          }
        } catch (guideError) {
          console.log("Not a guide:", guideError.message);
        }

        // Try to fetch agency data
        try {
          const agencyResponse = await axios.get(
            `http://localhost:5000/agency/${userId}`
          );
          console.log("Agency response:", agencyResponse.data);
          if (agencyResponse.data) {
            console.log("Setting role to agency");
            setRole("agency");
            return;
          }
        } catch (agencyError) {
          console.log("Not an agency:", agencyError.message);
        }

        console.log("Could not determine role, defaulting to guest");
        setRole("guest");
      } finally {
        setLoading(false);
      }
    };

    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/packages/${packageId}`);
        setPackageDetails(response.data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };

    determineUserRole();
    fetchPackageDetails();
  }, [token, packageId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {/* Navbars removed - now using RoleBasedNavbar from Layout component */}

      {/* Package details */}
      <ViewPackage />

      {/* Role-specific actions */}
      <div className="bg-gray-100 p-4 mb-4">
        <p className="text-center font-bold">Current Role: {role}</p>
      </div>

      {role === "customer" && <CustomerPackActions />}
      {role === "agency" && (
        <>
          <AgentPackActions />
          {/* Show guide requests for this package */}
          <div className="container mx-auto px-4 py-8">
            <GuideRequestsList
              packageId={packageId}
            />
          </div>
        </>
      )}
      {role === "guide" && (
        <div className="container mx-auto px-4 py-8">
          <GuidePackActions />
        </div>
      )}
      {!role && <p>No role found for the current user.</p>}
    </div>
  );
};

export default ViewPage;
