import React, { useState, useEffect } from "react";

const EggGroupFilter = ({ onEggGroupChange }) => {
    const [eggGroups, setEggGroups] = useState([]);
    const [selectedEggGroup, setSelectedEggGroup] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEggGroups = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/egg-group/");
                const data = await response.json();
                setEggGroups(data.results);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching egg groups:", error);
                setLoading(false);
            }
        };

        fetchEggGroups();
    }, []);

    const handleEggGroupChange = (event) => {
        const eggGroup = event.target.value;
        setSelectedEggGroup(eggGroup);
        onEggGroupChange(eggGroup);
    };

    return (
        <div className="card filter-card h-100 border-0">
            <div className="card-body">
                <h5 className="card-title filter-label">Egg Group Filter</h5>
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
                            value={selectedEggGroup}
                            onChange={handleEggGroupChange}
                            aria-label="Select Egg Group"
                        >
                            <option value="">All Egg Groups</option>
                            {eggGroups.map((eggGroup) => (
                                <option key={eggGroup.name} value={eggGroup.url}>
                                    {eggGroup.name.charAt(0).toUpperCase() + eggGroup.name.slice(1)}
                                </option>
                            ))}
                        </select>
                        <small className="text-muted mt-2 d-block">
                            Filter Pokémon by their breeding egg group
                        </small>
                    </>
                )}
            </div>
        </div>
    );
};

export default EggGroupFilter;