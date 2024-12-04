import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Navbar from "../components/Navbar";

const Search = () => {
  const [locations, setLocations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [entityType, setEntityType] = useState("");
  const [availability, setAvailability] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [minGroupSize, setMinGroupSize] = useState("");
  const [maxGroupSize, setMaxGroupSize] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const guideLocations = await axios.get(
          "http://localhost:5000/search/guide-locations"
        );
        const packageLocations = await axios.get(
          "http://localhost:5000/search/package-locations"
        );
        const allLocations = [
          ...new Set([
            ...guideLocations.data.locations,
            ...packageLocations.data,
          ]),
        ];
        setLocations(allLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/search/guide-languages"
        );
        setLanguages(response.data || []);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLocations();
    fetchLanguages();
  }, []);

  const handleSearch = async () => {
    if (selectedLocation && entityType) {
      try {
        const response = await axios.get("http://localhost:5000/search", {
          params: {
            location: selectedLocation,
            entityType,
            availability,
            language: selectedLanguage,
            minDuration,
            maxDuration,
            minGroupSize,
            maxGroupSize,
            minPrice,
            maxPrice,
            availableDates,
          },
        });
        setSearchResults(response.data || []);
      } catch (error) {
        console.error("Error searching:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center mb-16 text-white">Search Packages and Guides</h1>
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <select
              className="w-full bg-white text-gray-800 border border-[#81c3d2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#81c3d2] focus:border-[#81c3d2] shadow-md transition-all duration-300 hover:bg-gray-100"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <select
              className="w-full bg-white text-gray-800 border border-[#81c3d2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#81c3d2] focus:border-[#81c3d2] shadow-md transition-all duration-300 hover:bg-gray-100"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Guide">Guide</option>
              <option value="Package">Package</option>
            </select>

            {entityType === "Guide" && (
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-[#81c3d2]"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                  />
                  <span>Available</span>
                </label>
                <select
                  className="w-full bg-white text-gray-800 border border-[#81c3d2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#81c3d2] focus:border-[#81c3d2] shadow-md transition-all duration-300 hover:bg-gray-100"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">Select Language</option>
                  {languages.map((lang, index) => (
                    <option key={index} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {entityType === "Package" && (
            <div className="bg-white bg-opacity-5 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Filters for Packages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Duration (days)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      className="w-full bg-white text-gray-800 border border-[#81c3d2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#81c3d2] focus:border-[#81c3d2] shadow-md transition-all duration-300 hover:bg-gray-100"
                      placeholder="Min"
                      value={minDuration}
                      onChange={(e) => setMinDuration(e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-full bg-white text-gray-800 border border-[#81c3d2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#81c3d2] focus:border-[#81c3d2] shadow-md transition-all duration-300 hover:bg-gray-100"
                      placeholder="Max"
                      value={maxDuration}
                      onChange={(e) => setMaxDuration(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Group Size</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      className="w-full bg-white text-gray-800 border border-[#81c3d2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#81c3d2] focus:border-[#81c3d2] shadow-md transition-all duration-300 hover:bg-gray-100"
                      placeholder="Min"
                      value={minGroupSize}
                      onChange={(e) => setMinGroupSize(e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-full bg-white text-gray-800 border border-[#81c3d2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#81c3d2] focus:border-[#81c3d2] shadow-md transition-all duration-300 hover:bg-gray-100"
                      placeholder="Max"
                      value={maxGroupSize}
                      onChange={(e) => setMaxGroupSize(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Price (Rs.)</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      className="w-full bg-white text-gray-800 border border-[#81c3d2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#81c3d2] focus:border-[#81c3d2] shadow-md transition-all duration-300 hover:bg-gray-100"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                      type="number"
                      className="w-full bg-white text-gray-800 border border-[#81c3d2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#81c3d2] focus:border-[#81c3d2] shadow-md transition-all duration-300 hover:bg-gray-100"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Available Dates</label>
                  <input
                    type="date"
                    className="w-full bg-white text-gray-800 border border-[#81c3d2] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#81c3d2] focus:border-[#81c3d2] shadow-md transition-all duration-300 hover:bg-gray-100"
                    onChange={(e) => {
                      const date = moment(e.target.value).format();
                      setAvailableDates([...availableDates, date]);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <button
            className="w-full bg-transparent text-transparent font-bold py-2 px-4 rounded-full border border-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:border-gray-300 bg-clip-text text-gradient"
            onClick={handleSearch}
            disabled={!selectedLocation || !entityType}
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-opacity-20">
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {result.name || result.title}
                  </h3>
                  {entityType === "Guide" ? (
                    <div className="text-gray-300">
                      <p><span className="font-semibold">Experience:</span> {result.experience}</p>
                      <p><span className="font-semibold">Availability:</span> {result.availability ? "Available" : "Unavailable"}</p>
                      <p><span className="font-semibold">Languages:</span> {result.languages.join(", ")}</p>
                      <p><span className="font-semibold">Location:</span> {result.location}</p>
                      <Link
                        to={`/guides/${result._id}`}
                        className="mt-4 inline-block w-full bg-[#81c3d2] text-white font-bold py-2 px-4 rounded-full hover:bg-[#2c494b] transition-colors duration-300 text-center"
                      >
                        View Guide
                      </Link>
                    </div>
                  ) : (
                    <div className="text-gray-300">
                      <p className="mb-2">{result.description}</p>
                      <p><span className="font-semibold">Duration:</span> {result.duration} days</p>
                      <p><span className="font-semibold">Max Group Size:</span> {result.maxGroupSize}</p>
                      <p><span className="font-semibold">Price:</span> Rs.{result.price}</p>
                      <p><span className="font-semibold">Available Dates:</span> {result.availableDates.map((date) => moment(date).format("YYYY-MM-DD")).join(", ")}</p>
                      <p><span className="font-semibold">Location:</span> {result.location}</p>
                      <Link
                        to={`/packages/${result._id}`}
                        className="mt-4 inline-block w-full bg-[#81c3d2] text-white font-bold py-2 px-4 rounded-full hover:bg-[#2c494b] transition-colors duration-300 text-center"
                      >
                        View Package
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-300 text-lg">
              No results found
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;

