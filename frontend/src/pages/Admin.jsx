import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersTable from "../components/UserTable";
import PackagesTable from "../components/PackagesTable";
import ReviewsTable from "../components/ReviewsTable";
import GuidesTable from "../components/GuideTable";
import BookingsTable from "../components/BookingsTable";
import AgencyTable from "../components/AgenciesTable";

const Admin = () => {
  const [entity, setEntity] = useState("customers");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [entity]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/admin/${entity}`);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEntityChange = (entity) => {
    setEntity(entity);
  };

  return (
    <div className="admin-container">
      <h1 className="text-center font-bold text-4xl m-8">Admin Dashboard</h1>

      <div className="tabs-container">
        {/* Sidebar Tabs */}
        <div role="tablist" className="tabs tabs-bordered sidebar-tabs">
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Users"
            onClick={() => handleEntityChange("customers")}
            defaultChecked
          />

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Packages"
            onClick={() => handleEntityChange("packages")}
          />

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Reviews"
            onClick={() => handleEntityChange("reviews")}
          />

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Guides"
            onClick={() => handleEntityChange("guides")}
          />

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Bookings"
            onClick={() => handleEntityChange("bookings")}
          />

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab"
            aria-label="Agency"
            onClick={() => handleEntityChange("agency")}
          />
        </div>

        {/* Main Content Area */}
        <div className="tab-content-container">
          {entity === "customers" ? (
            <UsersTable users={data} />
          ) : entity === "packages" ? (
            <PackagesTable packages={data} />
          ) : entity === "reviews" ? (
            <ReviewsTable reviews={data} />
          ) : entity === "guides" ? (
            <GuidesTable guides={data} />
          ) : entity === "bookings" ? (
            <BookingsTable bookings={data} />
          ) : entity === "agency" ? (
            <AgencyTable agencies={data} />
          ) : (
            <div>No Data Available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
