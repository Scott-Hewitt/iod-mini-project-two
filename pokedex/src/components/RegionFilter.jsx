import React, { useState, useEffect } from "react";

const RegionFilter = ({ selectedRegion, onSelectRegion, onFilterChange }) => {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRegions = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://pokeapi.co/api/v2/region");
                const data = await response.json();
                setRegions(data.results);
            } catch (error) {
                console.error("Error fetching regions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRegions();
    }, []);

    useEffect(() => {
        if (selectedRegion && regions.length > 0) {
            const region = regions.find(r => r.url === selectedRegion);
            if (region) {
                const displayName = region.name.charAt(0).toUpperCase() + region.name.slice(1);
                onFilterChange("region", displayName, true);
            }
        } else {
            onFilterChange("region", "", false);
        }
    }, [selectedRegion, regions, onFilterChange]);

    return (
        <div className="card h-100">
            <div className="card-header bg-warning text-dark">
                <i className="bi bi-geo-alt-fill me-2"></i>Region
            </div>
            <div className="card-body">
                <select
                    className="form-select"
                    value={selectedRegion}
                    onChange={(e) => onSelectRegion(e.target.value)}
                    disabled={loading}
                >
                    <option value="">All Regions</option>
                    {regions.map((region) => (
                        <option key={region.name} value={region.url}>
                            {region.name.charAt(0).toUpperCase() + region.name.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default RegionFilter;