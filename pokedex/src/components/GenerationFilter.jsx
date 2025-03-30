import React, { useState, useEffect } from "react";

const GenerationFilter = ({ selectedGeneration, onSelectGeneration, onFilterChange }) => {
    const [generations, setGenerations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        const fetchGenerations = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://pokeapi.co/api/v2/generation");
                const data = await response.json();
                setGenerations(data.results);
            } catch (error) {
                console.error("Error fetching generations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenerations();
    }, []);

    useEffect(() => {
        if (selectedGeneration && generations.length > 0) {
            const gen = generations.find(g => g.url === selectedGeneration);
            if (gen) {
                const genNumber = gen.url.split("/")[6];
                setDisplayName(`Generation ${genNumber}`);
                onFilterChange("generation", `Generation ${genNumber}`, true);
            }
        } else {
            setDisplayName("");
            onFilterChange("generation", "", false);
        }
    }, [selectedGeneration, generations, onFilterChange]);

    return (
        <div className="card h-100">
            <div className="card-header bg-success text-white">
                <i className="bi bi-clock-history me-2"></i>Generation
            </div>
            <div className="card-body">
                <select
                    className="form-select"
                    value={selectedGeneration}
                    onChange={(e) => onSelectGeneration(e.target.value)}
                    disabled={loading}
                >
                    <option value="">All Generations</option>
                    {generations.map((gen) => {
                        const genNumber = gen.url.split("/")[6];
                        return (
                            <option key={gen.name} value={gen.url}>
                                Generation {genNumber}
                            </option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
};

export default GenerationFilter;