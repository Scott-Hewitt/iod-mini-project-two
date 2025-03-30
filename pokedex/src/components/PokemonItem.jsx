import React, { useState, useEffect } from "react";
import { fetchPokemonSpecies } from "../services/pokeApi.jsx";

const PokemonItem = ({ pokemon }) => {
    const [details, setDetails] = useState(null);
    const [species, setSpecies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            setLoading(true);
            try {
                let url = pokemon.url;
                let pokemonId;

                if (url.includes("pokemon-species")) {
                    const speciesResponse = await fetch(url);
                    const speciesData = await speciesResponse.json();
                    const pokemonResponse = await fetch(speciesData.varieties[0].pokemon.url);
                    url = speciesData.varieties[0].pokemon.url;
                    const data = await pokemonResponse.json();
                    setDetails(data);
                    setSpecies(speciesData);
                    pokemonId = data.id;
                } else {
                    const response = await fetch(url);
                    const data = await response.json();
                    setDetails(data);
                    pokemonId = data.id;
                    const speciesData = await fetchPokemonSpecies(pokemonId);
                    setSpecies(speciesData);
                }
                setError(null);
            } catch (err) {
                setError("Failed to load Pokémon details");
                console.error("Error fetching Pokémon details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemonDetails();
    }, [pokemon.url]);

    const getTypeClass = (type) => {
        const typeClasses = {
            normal: "bg-secondary text-white",
            fire: "bg-danger text-white",
            water: "bg-primary text-white",
            grass: "bg-success text-white",
            electric: "bg-warning text-dark",
            ice: "bg-info text-dark",
            fighting: "bg-danger text-white",
            poison: "bg-purple text-white",
            ground: "bg-brown text-white",
            flying: "bg-info text-dark",
            psychic: "bg-pink text-dark",
            bug: "bg-success text-white",
            rock: "bg-brown text-white",
            ghost: "bg-purple text-white",
            dragon: "bg-primary text-white",
            dark: "bg-dark text-white",
            steel: "bg-secondary text-dark",
            fairy: "bg-pink text-dark"
        };

        return typeClasses[type] || "bg-secondary text-white";
    };

    const getEnglishDescription = () => {
        if (!species || !species.flavor_text_entries) return "No description available.";

        const englishEntry = species.flavor_text_entries.find(
            entry => entry.language.name === "en"
        );

        return englishEntry
            ? englishEntry.flavor_text.replace(/\f/g, " ")
            : "No English description available.";
    };

    const calculateStatPercentage = (value) => {
        return Math.min(100, (value / 255) * 100);
    };

    const handleCardFlip = () => {
        setIsFlipped(!isFlipped);
    };

    if (loading) {
        return (
            <div className="card shadow-sm h-100">
                <div className="card-body text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !details) {
        return (
            <div className="card shadow-sm h-100">
                <div className="card-body text-center py-5">
                    <i className="bi bi-exclamation-triangle text-warning fs-1"></i>
                    <p className="mt-3">{error || "Failed to load Pokémon details"}</p>
                </div>
            </div>
        );
    }

    // Main content with wider card layout
    return (
        <div className="flip-card-container">
            <div
                className={`flip-card pokemon-card hover-shadow ${isFlipped ? 'is-flipped' : ''}`}
                onClick={handleCardFlip}
            >
                {/* Front of Card */}
                <div className="flip-card-face flip-card-front card shadow-sm h-100">
                    <div className={`card-header ${details.types && details.types[0] ? getTypeClass(details.types[0].type.name) : ''}`}>
                        <h5 className="card-title mb-0">
                            {details.name.charAt(0).toUpperCase() + details.name.slice(1)}{" "}
                            <small className="text-muted">#{details.id}</small>
                        </h5>
                    </div>
                    <div className="card-body d-flex flex-column">
                        <div className="pokemon-image-container">
                            <img
                                src={details.sprites?.other?.['official-artwork']?.front_default || details.sprites?.front_default}
                                alt={details.name}
                                className="pokemon-image"
                            />
                        </div>

                        <div className="mt-3">
                            <div className="d-flex justify-content-between">
                                <span><strong>Height:</strong> {details.height / 10}m</span>
                                <span><strong>Weight:</strong> {details.weight / 10}kg</span>
                            </div>

                            <div className="mt-2">
                                <strong>Types:</strong>{" "}
                                {details.types.map((typeInfo, index) => (
                                    <span
                                        key={index}
                                        className={`badge me-1 ${getTypeClass(typeInfo.type.name)}`}
                                    >
                                        {typeInfo.type.name}
                                    </span>
                                ))}
                            </div>

                            <div className="description-container mt-3">
                                <p className="description-text">
                                    {getEnglishDescription()}
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto text-center">
                            <small className="text-muted">Click for stats</small>
                        </div>
                    </div>
                </div>

                {/* Back of Card */}
                <div className="flip-card-face flip-card-back card shadow-sm h-100">
                    <div className={`card-header ${details.types && details.types[0] ? getTypeClass(details.types[0].type.name) : ''}`}>
                        <h5 className="card-title mb-0">
                            {details.name.charAt(0).toUpperCase() + details.name.slice(1)} Stats
                        </h5>
                    </div>
                    <div className="card-body d-flex flex-column">
                        <h6 className="mb-3">Base Stats</h6>
                        <div className="stat-container">
                            {details.stats.map((stat, index) => (
                                <div key={index} className="stat-box mb-2">
                                    <div className="d-flex justify-content-between">
                                        <strong>{stat.stat.name.replace('-', ' ')}</strong>
                                        <span>{stat.base_stat}</span>
                                    </div>
                                    <div className="progress mt-1">
                                        <div
                                            className={`progress-bar ${details.types && details.types[0] ? getTypeClass(details.types[0].type.name) : ''}`}
                                            role="progressbar"
                                            style={{ width: `${calculateStatPercentage(stat.base_stat)}%` }}
                                            aria-valuenow={stat.base_stat}
                                            aria-valuemin="0"
                                            aria-valuemax="255"
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h6 className="mt-3 mb-2">Abilities</h6>
                        <div className="mb-3">
                            {details.abilities.map((ability, index) => (
                                <span key={index} className="badge bg-secondary me-1 mb-1">
                                    {ability.ability.name.replace('-', ' ')}
                                </span>
                            ))}
                        </div>

                        <div className="mt-auto text-center">
                            <small className="text-muted">Click to go back</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonItem;