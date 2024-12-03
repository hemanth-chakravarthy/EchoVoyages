import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersTable from "../components/UserTable";
import PackagesTable from "../components/PackagesTable";
import ReviewsTable from "../components/ReviewsTable";
import GuidesTable from "../components/GuideTable";
import BookingsTable from "../components/BookingsTable";
import AgencyTable from "../components/AgenciesTable";
import { BookingsChart, UserTypeDistribution, RevenueChart } from "../components/dashboard/DashboardCharts";
import DashboardStats from "../components/dashboard/DashboardStats";

const Admin = () => {
  const [entity, setEntity] = useState("dashboard");
  const [data, setData] = useState({
    customers: [],
    packages: [],
    reviews: [],
    guides: [],
    bookings: [],
    agencies: [],
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const endpoints = ['customers', 'packages', 'reviews', 'guides', 'bookings', 'agency'];
      const responses = await Promise.all(
        endpoints.map(endpoint => 
          axios.get(`http://localhost:5000/admin/${endpoint}`)
        )
      );
      
      const newData = {};
      endpoints.forEach((endpoint, index) => {
        newData[endpoint] = responses[index].data.data;
      });
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEntityChange = (newEntity) => {
    setEntity(newEntity);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <DashboardStats data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingsChart data={data.bookings} />
        <UserTypeDistribution data={data.customers} />
      </div>
      
      <div className="mt-6">
        <RevenueChart data={data.bookings} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-4xl font-bold text-foreground mb-8">Admin Dashboard</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-2">
          <button
            onClick={() => handleEntityChange("dashboard")}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              entity === "dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleEntityChange("customers")}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              entity === "customers" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => handleEntityChange("packages")}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              entity === "packages" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            Packages
          </button>
          <button
            onClick={() => handleEntityChange("reviews")}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              entity === "reviews" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => handleEntityChange("guides")}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              entity === "guides" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            Guides
          </button>
          <button
            onClick={() => handleEntityChange("bookings")}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              entity === "bookings" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => handleEntityChange("agency")}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
              entity === "agency" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            Agencies
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-card rounded-lg p-6">
          {entity === "dashboard" ? (
            renderDashboard()
          ) : entity === "customers" ? (
            <UsersTable users={data.customers} />
          ) : entity === "packages" ? (
            <PackagesTable packages={data.packages} />
          ) : entity === "reviews" ? (
            <ReviewsTable reviews={data.reviews} />
          ) : entity === "guides" ? (
            <GuidesTable guides={data.guides} />
          ) : entity === "bookings" ? (
            <BookingsTable bookings={data.bookings} />
          ) : entity === "agency" ? (
            <AgencyTable agencies={data.agencies} />
          ) : (
            <div>No Data Available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;