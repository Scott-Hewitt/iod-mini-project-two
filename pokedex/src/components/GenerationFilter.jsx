import React, { useState, useEffect } from "react";

const GenerationFilter = ({ onGenerationChange }) => {
    const [generations, setGenerations] = useState([]);
    const [selectedGeneration, setSelectedGeneration] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenerations = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/generation");
                const data = await response.json();
                setGenerations(data.results); // List of generations
                setLoading(false);
            } catch (error) {
                console.error("Error fetching generations:", error);
                setLoading(false);
            }
        };

        fetchGenerations();
    }, []);

    const handleGenerationChange = (event) => {
        const generation = event.target.value;
        setSelectedGeneration(generation);
        onGenerationChange(generation);
    };

    return (
        <div className="card filter-card h-100 border-0">
            <div className="card-body">
                <h5 className="card-title filter-label">Generation Filter</h5>
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
                            value={selectedGeneration}
                            onChange={handleGenerationChange}
                            aria-label="Select Generation"
                        >
                            <option value="">All Generations</option>
                            {generations.map((generation, index) => (
                                <option key={generation.name} value={generation.url}>
                                    {`Generation ${index + 1}`}
                                </option>
                            ))}
                        </select>
                        <small className="text-muted mt-2 d-block">
                            Filter Pokémon by the game generation they were introduced in
                        </small>
                    </>
                )}
            </div>
        </div>
    );
};

export default GenerationFilter;