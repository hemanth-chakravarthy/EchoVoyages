import React from "react";
import AgentInfo from "../components/AgentInfo";
import { Link } from "react-router-dom";

const AgentProfilePage = () => {
  return (
    <div>
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
      <AgentInfo />
    </div>
  );
};

export default AgentProfilePage;
