import React, { useState, useEffect } from "react";

const EggGroupFilter = ({ selectedEggGroup, onSelectEggGroup, onFilterChange }) => {
    const [eggGroups, setEggGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEggGroups = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://pokeapi.co/api/v2/egg-group");
                const data = await response.json();
                setEggGroups(data.results);
            } catch (error) {
                console.error("Error fetching egg groups:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEggGroups();
    }, []);

    useEffect(() => {
        if (selectedEggGroup && eggGroups.length > 0) {
            const group = eggGroups.find(g => g.url === selectedEggGroup);
            if (group) {
                const displayName = group.name.charAt(0).toUpperCase() + group.name.slice(1).replace("-", " ");
                onFilterChange("eggGroup", displayName, true);
            }
        } else {
            onFilterChange("eggGroup", "", false);
        }
    }, [selectedEggGroup, eggGroups, onFilterChange]);

    return (
        <div className="card h-100">
            <div className="card-header bg-danger text-white">
                <i className="bi bi-egg-fill me-2"></i>Egg Group
            </div>
            <div className="card-body">
                <select
                    className="form-select"
                    value={selectedEggGroup}
                    onChange={(e) => onSelectEggGroup(e.target.value)}
                    disabled={loading}
                >
                    <option value="">All Egg Groups</option>
                    {eggGroups.map((group) => (
                        <option key={group.name} value={group.url}>
                            {group.name.charAt(0).toUpperCase() + group.name.slice(1).replace("-", " ")}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default EggGroupFilter;