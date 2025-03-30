import React, { useState, useEffect } from "react";

const GenerationFilter = ({ onGenerationChange }) => {
    const [generations, setGenerations] = useState([]);
    const [selectedGeneration, setSelectedGeneration] = useState("");

    useEffect(() => {
        const fetchGenerations = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/generation");
                const data = await response.json();
                setGenerations(data.results); // List of generations
            } catch (error) {
                console.error("Error fetching generations:", error);
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
        <div>
            <label htmlFor="generation-select">Filter by Generation:</label>
            <select
                id="generation-select"
                value={selectedGeneration}
                onChange={handleGenerationChange}
                style={styles.select}
            >
                <option value="">All Generations</option>
                {generations.map((generation, index) => (
                    <option key={generation.name} value={generation.url}>
                        {`Generation ${index + 1}`}
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

export default GenerationFilter;