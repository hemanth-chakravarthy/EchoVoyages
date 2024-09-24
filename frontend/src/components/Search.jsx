import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const Search = () => {
    const [locations, setLocations] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [entityType, setEntityType] = useState('');
    const [availability, setAvailability] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [minDuration, setMinDuration] = useState('');
    const [maxDuration, setMaxDuration] = useState('');
    const [minGroupSize, setMinGroupSize] = useState('');
    const [maxGroupSize, setMaxGroupSize] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [availableDates, setAvailableDates] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const guideLocations = await axios.get('http://localhost:5000/search/guide-locations');
                const packageLocations = await axios.get('http://localhost:5000/search/package-locations');
                const allLocations = [...new Set([...guideLocations.data.locations, ...packageLocations.data])];
                setLocations(allLocations);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        
        const fetchLanguages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/search/guide-languages');
                setLanguages(response.data);
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        };

        fetchLocations();
        fetchLanguages();
    }, []);

    const handleSearch = async () => {
        if (selectedLocation && entityType) {
            try {
                const response = await axios.get('http://localhost:5000/search', {
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
                        availableDates
                    }
                });
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error searching:', error);
            }
        }
    };

    return (
        <div>
            <h2>Search</h2>
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                <option value="">Select Location</option>
                {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                ))}
            </select>

            <select value={entityType} onChange={(e) => setEntityType(e.target.value)}>
                <option value="">Select Type</option>
                <option value="Guide">Guide</option>
                <option value="Package">Package</option>
            </select>

            {entityType === 'Guide' && (
                <>
                    <label>
                        Availability:
                        <input 
                            type="checkbox" 
                            checked={availability} 
                            onChange={(e) => setAvailability(e.target.checked)} 
                        />
                    </label>
                    <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                        <option value="">Select Language</option>
                        {languages.map((lang, index) => (
                            <option key={index} value={lang}>{lang}</option>
                        ))}
                    </select>
                </>
            )}

            {entityType === 'Package' && (
                <>
                    <div>
                        <h3>Filters for Packages</h3>
                        <div>
                            <label>Duration:</label>
                            <input
                                type="number"
                                placeholder="Min"
                                value={minDuration}
                                onChange={(e) => setMinDuration(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxDuration}
                                onChange={(e) => setMaxDuration(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Max Group Size:</label>
                            <input
                                type="number"
                                placeholder="Min"
                                value={minGroupSize}
                                onChange={(e) => setMinGroupSize(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxGroupSize}
                                onChange={(e) => setMaxGroupSize(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Price:</label>
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Available Dates:</label>
                            <input
                                type="date"
                                onChange={(e) => {
                                    const date = moment(e.target.value).format();
                                    setAvailableDates([...availableDates, date]);
                                }}
                            />
                            <button onClick={() => setAvailableDates([])}>Clear Dates</button>
                        </div>
                    </div>
                </>
            )}

            <button onClick={handleSearch} disabled={!selectedLocation || !entityType}>Search</button>

            <div>
                {searchResults.map((result, index) => (
                    <div key={index}>
                        <h3>{result.name}</h3>
                        <p>{result.description || result.experience}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;
