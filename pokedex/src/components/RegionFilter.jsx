import React, { useState, useEffect } from "react";

const RegionFilter = ({ onRegionChange }) => {
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/region/");
                const data = await response.json();
                setRegions(data.results); // Array of regions
                setLoading(false);
            } catch (error) {
                console.error("Error fetching regions:", error);
                setLoading(false);
            }
        };

        fetchRegions();
    }, []);

    const handleRegionChange = (event) => {
        const region = event.target.value; // Region name or URL
        setSelectedRegion(region);
        onRegionChange(region);
    };

    return (
        <div className="card filter-card h-100 border-0">
            <div className="card-body">
                <h5 className="card-title filter-label">Region Filter</h5>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <select
                            className="form-select"
                            value={selectedRegion}
                            onChange={handleRegionChange}
                            aria-label="Select Region"
                        >
                            <option value="">All Regions</option>
                            {regions.map((region) => (
                                <option key={region.name} value={region.url}>
                                    {region.name.charAt(0).toUpperCase() + region.name.slice(1)}
                                </option>
                            ))}
                        </select>
                        <small className="text-muted mt-2 d-block">
                            Filter Pokémon by their native region
                        </small>
                    </>
                )}
            </div>
        </div>
    );
};

export default RegionFilter;