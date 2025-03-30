import React, { useState, useEffect } from "react";

const PokemonItem = ({ pokemon }) => {
    const [pokemonData, setPokemonData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [description, setDescription] = useState("");

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const response = await fetch(pokemon.url);
                const data = await response.json();
                setPokemonData(data);
                try {
                    const speciesResponse = await fetch(data.species.url);
                    const speciesData = await speciesResponse.json();
                    const englishEntry = speciesData.flavor_text_entries.find(
                        entry => entry.language.name === 'en'
                    );

                    if (englishEntry) {
                        setDescription(englishEntry.flavor_text.replace(/[\n\f]/g, ' '));
                    }
                } catch (speciesError) {
                    console.error("Error fetching species data:", speciesError);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching Pokémon details:", error);
                setLoading(false);
            }
        };

        fetchPokemonDetails();
    }, [pokemon]);

    if (loading) {
        return (
            <div className="card pokemon-card shadow-sm h-100">
                <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: "250px" }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!pokemonData) {
        return (
            <div className="card pokemon-card shadow-sm h-100">
                <div className="card-body text-center" style={{ minHeight: "250px" }}>
                    <p className="text-danger">Failed to load Pokémon data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card pokemon-card h-100 shadow-sm hover-shadow transition">
            <div className="card-header bg-light text-center d-flex justify-content-between align-items-center">
                <span className="badge bg-secondary">#{pokemonData.id.toString().padStart(3, '0')}</span>
                <span className="text-muted small">
                    {pokemonData.weight / 10}kg / {pokemonData.height / 10}m
                </span>
            </div>
            <div className="card-body text-center">
                <div className="pokemon-image-container mb-2">
                    {pokemonData.sprites.front_default ? (
                        <img
                            src={pokemonData.sprites.front_default}
                            alt={pokemonData.name}
                            className="img-fluid pokemon-image"
                            loading="lazy"
                        />
                    ) : (
                        <div className="no-image-placeholder">
                            <i className="bi bi-question-circle-fill"></i>
                        </div>
                    )}
                </div>
                <h5 className="card-title fw-bold mb-2">
                    {pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}
                </h5>
                {description && (
                    <div className="description-container">
                        <p className="card-text small text-muted mb-3 description-text">
                            {description}
                        </p>
                    </div>
                )}

                <div className="d-flex justify-content-center gap-2 mb-2">
                    {pokemonData.types.map((type) => (
                        <span
                            key={type.type.name}
                            className="badge rounded-pill"
                            style={{
                                backgroundColor: getTypeColor(type.type.name),
                                color: "#fff"
                            }}
                        >
                            {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                        </span>
                    ))}
                </div>

                <div className="stats-container small">
                    <div className="row g-1 mt-2">
                        {pokemonData.stats.slice(0, 3).map(stat => (
                            <div key={stat.stat.name} className="col-4">
                                <div className="stat-box p-1 rounded">
                                    <div className="stat-name text-uppercase small">
                                        {stat.stat.name.replace('-', ' ')}
                                    </div>
                                    <div className="stat-value fw-bold">
                                        {stat.base_stat}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const getTypeColor = (type) => {
    const typeColors = {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        electric: "#F7D02C",
        grass: "#7AC74C",
        ice: "#96D9D6",
        fighting: "#C22E28",
        poison: "#A33EA1",
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A6B91A",
        rock: "#B6A136",
        ghost: "#735797",
        dragon: "#6F35FC",
        dark: "#705746",
        steel: "#B7B7CE",
        fairy: "#D685AD",
        // Default color
        default: "#777777"
    };

    return typeColors[type] || typeColors.default;
};


export default PokemonItem;