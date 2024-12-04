import React, { useEffect, useState } from "react";
import CustomerPackActions from "../components/CustomerPackActions";
import AgentPackActions from "../components/AgentPackActions";
import ViewPackage from "../components/ViewPackage";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

const ViewPage = () => {
  const [role, setRole] = useState("agent");
  const [loading, setLoading] = useState(true);
  const rolefinder = useParams();

  const token = localStorage.getItem("token");
  const id = jwtDecode(token).id;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const customerResponse = await axios.get(
          `http://localhost:5000/customers/${id}`
        );
        if (
          customerResponse.data &&
          customerResponse.data.role === "customer"
        ) {
          setRole("customer");
        }
        // else {
        //     const agentResponse = await axios.get(`http://localhost:5000/agents/${id}`);
        //     if (agentResponse.data && agentResponse.data.role === 'travel agency') {
        //         setRole('travel agency');
        //     }
        // }
      } catch (error) {
        console.error("Error fetching user role:", error);
        alert("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {role === "customer" && <Navbar />}
      {role !== "customer" && (
        <>
          <div className="navbar bg-base-100">
            <div className="flex-1">
              <a className="btn btn-ghost text-xl">EchoVoyages</a>
            </div>
            <div className="flex-none gap-2">
              <div className="flex space-x-4">
                <Link to="/AgentHome" className="btn btn-ghost">
                  Home Page
                </Link>
                <Link to="/mylistings" className="btn btn-ghost">
                  My Listings
                </Link>
                <Link to="/createPackage" className="btn btn-ghost">
                  Create Package
                </Link>
                <Link to="/AgentProfilePage" className="btn btn-ghost">
                  Profile Page
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
      <ViewPackage />
      {role === "customer" && <CustomerPackActions />}
      {role !== "customer" && <AgentPackActions />}
      {!role && <p>No role found for the current user.</p>}
    </div>
  );
};

export default ViewPage;
