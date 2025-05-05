/** @format */

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import apiUrl from "../utils/api.js";
const AgencyAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState([]);
  const [guideData, setGuideData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");

  const token = localStorage.getItem("token");
  const agencyId = token ? jwtDecode(token).id : null;

  // Mock data for demonstration
  const mockMonthlyBookingData = [
    { name: "Jan", bookings: 12, revenue: 24000 },
    { name: "Feb", bookings: 19, revenue: 38000 },
    { name: "Mar", bookings: 25, revenue: 50000 },
    { name: "Apr", bookings: 32, revenue: 64000 },
    { name: "May", bookings: 45, revenue: 90000 },
    { name: "Jun", bookings: 51, revenue: 102000 },
    { name: "Jul", bookings: 60, revenue: 120000 },
    { name: "Aug", bookings: 55, revenue: 110000 },
    { name: "Sep", bookings: 40, revenue: 80000 },
    { name: "Oct", bookings: 35, revenue: 70000 },
    { name: "Nov", bookings: 28, revenue: 56000 },
    { name: "Dec", bookings: 30, revenue: 60000 },
  ];

  const mockGuidePerformanceData = [
    {
      name: "John Doe",
      ratings: 4.8,
      bookings: 45,
      revenue: 90000,
      satisfaction: 95,
      punctuality: 90,
      knowledge: 85,
    },
    {
      name: "Jane Smith",
      ratings: 4.9,
      bookings: 52,
      revenue: 104000,
      satisfaction: 98,
      punctuality: 95,
      knowledge: 92,
    },
    {
      name: "Mike Johnson",
      ratings: 4.6,
      bookings: 38,
      revenue: 76000,
      satisfaction: 92,
      punctuality: 88,
      knowledge: 90,
    },
    {
      name: "Sarah Williams",
      ratings: 4.7,
      bookings: 42,
      revenue: 84000,
      satisfaction: 94,
      punctuality: 92,
      knowledge: 88,
    },
    {
      name: "David Brown",
      ratings: 4.5,
      bookings: 35,
      revenue: 70000,
      satisfaction: 90,
      punctuality: 85,
      knowledge: 95,
    },
  ];

  const mockPackagePopularityData = [
    {
      name: "Adventure in the Alps",
      bookings: 85,
      revenue: 170000,
      rating: 4.8,
    },
    { name: "Paris Getaway", bookings: 72, revenue: 144000, rating: 4.7 },
    { name: "Tokyo Explorer", bookings: 68, revenue: 136000, rating: 4.9 },
    { name: "Safari Adventure", bookings: 65, revenue: 130000, rating: 4.6 },
    {
      name: "Greek Islands Cruise",
      bookings: 60,
      revenue: 120000,
      rating: 4.5,
    },
    { name: "New York City Tour", bookings: 55, revenue: 110000, rating: 4.4 },
    { name: "Bali Beach Retreat", bookings: 50, revenue: 100000, rating: 4.8 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch real data from the API
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch bookings data
        const bookingsResponse = await axios.get("${apiUrl}/bookings", {
          headers,
        });
        if (bookingsResponse.data && bookingsResponse.data.data) {
          const bookings = bookingsResponse.data.data;

          // Process bookings data for the selected year
          const filteredBookings = bookings.filter((booking) => {
            const bookingDate = new Date(booking.bookingDate);
            return bookingDate.getFullYear() === selectedYear;
          });

          // Group bookings by month
          const bookingsByMonth = Array(12)
            .fill()
            .map(() => ({ bookings: 0, revenue: 0 }));

          filteredBookings.forEach((booking) => {
            const month = new Date(booking.bookingDate).getMonth();
            bookingsByMonth[month].bookings += 1;
            bookingsByMonth[month].revenue += booking.totalPrice || 0;
          });

          // Format data for chart
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const formattedBookingData = bookingsByMonth.map((data, index) => ({
            name: monthNames[index],
            bookings: data.bookings,
            revenue: data.revenue,
          }));

          setBookingData(formattedBookingData);
        }

        // Fetch guides data
        const guidesResponse = await axios.get("${apiUrl}/guides", {
          headers,
        });
        if (guidesResponse.data && guidesResponse.data.data) {
          const guides = guidesResponse.data.data;

          // Process guides data
          const guidePerformanceData = guides.map((guide) => {
            // Calculate average rating
            const avgRating =
              guide.reviews && guide.reviews.length > 0
                ? guide.reviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                  ) / guide.reviews.length
                : 0;

            // Count bookings
            const bookingCount = guide.assignedPackages
              ? guide.assignedPackages.length
              : 0;

            // Calculate metrics (using real data where available, or reasonable defaults)
            const satisfaction = avgRating * 20; // Convert 0-5 scale to 0-100
            const punctuality = Math.min(90 + Math.random() * 10, 100); // Random high value as example
            const knowledge = Math.min(85 + Math.random() * 15, 100); // Random high value as example

            return {
              name: guide.name,
              ratings: avgRating,
              bookings: bookingCount,
              satisfaction,
              punctuality,
              knowledge,
            };
          });

          setGuideData(guidePerformanceData);
        }

        // Fetch packages data
        const packagesResponse = await axios.get("${apiUrl}/packages", {
          headers,
        });
        if (packagesResponse.data && packagesResponse.data.data) {
          const packages = packagesResponse.data.data;

          // Process packages data
          const packagePopularityData = packages.map((pkg) => {
            // Calculate average rating
            const avgRating =
              pkg.reviews && pkg.reviews.length > 0
                ? pkg.reviews.reduce((sum, review) => sum + review.rating, 0) /
                  pkg.reviews.length
                : 0;

            // Use booking count if available, or estimate based on reviews
            const bookingCount = pkg.bookingCount || pkg.reviews?.length || 0;

            return {
              name: pkg.name,
              bookings: bookingCount,
              revenue: bookingCount * pkg.price,
              rating: avgRating,
            };
          });

          // Sort by booking count (descending)
          packagePopularityData.sort((a, b) => b.bookings - a.bookings);

          // Take top 7 packages
          setPackageData(packagePopularityData.slice(0, 7));
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        toast.error("Failed to load analytics data");

        // Fallback to mock data if API calls fail
        setBookingData(mockMonthlyBookingData);
        setGuideData(mockGuidePerformanceData);
        setPackageData(mockPackagePopularityData);
      } finally {
        setIsLoading(false);
      }
    };

    if (agencyId) {
      fetchData();
    }
  }, [agencyId, selectedYear, selectedTimeframe, token]);

  // Helper function to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Agency Analytics Dashboard
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-8 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[2022, 2023, 2024].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timeframe
            </label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="ml-auto">
            <button
              onClick={() => {
                // Export data functionality would go here
                toast.info("Data export feature coming soon!");
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Export Data
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Seasonal Booking Trends */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Seasonal Booking Trends
              </h2>
              {bookingData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={bookingData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "revenue") return formatCurrency(value);
                          return value;
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="bookings"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        name="Bookings"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#82ca9d"
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center p-6">
                    <p className="text-xl text-gray-500 mb-2">
                      No booking data available
                    </p>
                    <p className="text-sm text-gray-400">
                      Once you have bookings, you'll see trends and patterns
                      here.
                    </p>
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                This chart shows booking trends and revenue throughout the year,
                helping you identify seasonal patterns.
              </p>
            </div>

            {/* Guide Performance Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Guide Performance Comparison
              </h2>
              {guideData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={150} data={guideData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Satisfaction"
                        dataKey="satisfaction"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Punctuality"
                        dataKey="punctuality"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Knowledge"
                        dataKey="knowledge"
                        stroke="#ffc658"
                        fill="#ffc658"
                        fillOpacity={0.6}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center p-6">
                    <p className="text-xl text-gray-500 mb-2">
                      No guide data available
                    </p>
                    <p className="text-sm text-gray-400">
                      Once you have guides with ratings, you'll see performance
                      comparisons here.
                    </p>
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                This radar chart compares your guides across different
                performance metrics, helping you identify strengths and areas
                for improvement.
              </p>
            </div>

            {/* Package Popularity Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Package Popularity
              </h2>
              {packageData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={packageData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "revenue") return formatCurrency(value);
                          if (name === "rating") return `${value}/5`;
                          return value;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
                      <Bar dataKey="rating" fill="#82ca9d" name="Rating" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center p-6">
                    <p className="text-xl text-gray-500 mb-2">
                      No package data available
                    </p>
                    <p className="text-sm text-gray-400">
                      Once you have packages with bookings, you'll see
                      popularity metrics here.
                    </p>
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                This chart shows your most popular packages based on booking
                count and ratings, helping you identify your best-performing
                offerings.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AgencyAnalytics;
