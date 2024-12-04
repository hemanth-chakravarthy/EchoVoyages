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
    <div className="min-h-screen bg-base-300">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">
          Search
        </h2>
        <div className="bg-base-200 shadow-lg rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <select
              className="select select-bordered w-full"
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
              className="select select-bordered w-full"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Guide">Guide</option>
              <option value="Package">Package</option>
            </select>

            {entityType === "Guide" && (
              <div className="flex items-center space-x-4">
                <label className="label cursor-pointer">
                  <span className="label-text mr-2">Availability:</span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                  />
                </label>
                <select
                  className="select select-bordered w-full"
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
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Filters for Packages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Duration (days)</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      placeholder="Min"
                      value={minDuration}
                      onChange={(e) => setMinDuration(e.target.value)}
                    />
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      placeholder="Max"
                      value={maxDuration}
                      onChange={(e) => setMaxDuration(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Group Size</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      placeholder="Min"
                      value={minGroupSize}
                      onChange={(e) => setMinGroupSize(e.target.value)}
                    />
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      placeholder="Max"
                      value={maxGroupSize}
                      onChange={(e) => setMaxGroupSize(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Price (Rs.)</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Available Dates</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
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
            className="btn btn-primary w-full"
            onClick={handleSearch}
            disabled={!selectedLocation || !entityType}
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-primary">
                    {result.name || result.title}
                  </h3>
                  {entityType === "Guide" ? (
                    <div>
                      <p>
                        <span className="font-semibold">Experience:</span>{" "}
                        {result.experience}
                      </p>
                      <p>
                        <span className="font-semibold">Availability:</span>{" "}
                        {result.availability ? "Available" : "Unavailable"}
                      </p>
                      <p>
                        <span className="font-semibold">Languages:</span>{" "}
                        {result.languages.join(", ")}
                      </p>
                      <p>
                        <span className="font-semibold">Location:</span>{" "}
                        {result.location}
                      </p>
                      <div className="card-actions justify-end mt-4">
                        <Link
                          to={`/guides/${result._id}`}
                          className="btn btn-primary"
                        >
                          View Guide
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2">{result.description}</p>
                      <p>
                        <span className="font-semibold">Duration:</span>{" "}
                        {result.duration} days
                      </p>
                      <p>
                        <span className="font-semibold">Max Group Size:</span>{" "}
                        {result.maxGroupSize}
                      </p>
                      <p>
                        <span className="font-semibold">Price:</span> Rs.
                        {result.price}
                      </p>
                      <p>
                        <span className="font-semibold">Available Dates:</span>{" "}
                        {result.availableDates
                          .map((date) => moment(date).format("YYYY-MM-DD"))
                          .join(", ")}
                      </p>
                      <p>
                        <span className="font-semibold">Location:</span>{" "}
                        {result.location}
                      </p>
                      <div className="card-actions justify-end mt-4">
                        <Link
                          to={`/packages/${result._id}`}
                          className="btn btn-primary"
                        >
                          View Package
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-lg">
              No results found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
