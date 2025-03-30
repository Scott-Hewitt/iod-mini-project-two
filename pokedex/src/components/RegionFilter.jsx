import React, { useState, useEffect } from "react";

const RegionFilter = ({ onRegionChange }) => {
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/region/");
                const data = await response.json();
                setRegions(data.results); // Array of regions
            } catch (error) {
                console.error("Error fetching regions:", error);
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
        <div>
            <label htmlFor="region-select">Filter by Region:</label>
            <select
                id="region-select"
                value={selectedRegion}
                onChange={handleRegionChange}
                style={styles.select}
            >
                <option value="">All Regions</option>
                {regions.map((region) => (
                    <option key={region.name} value={region.url}>
                        {region.name.charAt(0).toUpperCase() + region.name.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
};

const styles = {
    select: {
        margin: "10px",
        padding: "8px 12px",
        fontSize: "16px",
        borderRadius: "4px",
        border: "1px solid #ddd",
    },
};

export default RegionFilter;