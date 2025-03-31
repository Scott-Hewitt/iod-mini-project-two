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

    return (
        <div className="flip-card-container">
            <div className={`flip-card ${isFlipped ? 'is-flipped' : ''}`} onClick={handleCardFlip}>
                <div className="flip-card-face flip-card-front">
                    <div className="pokedex-lights">
                        <div className="pokedex-light pokedex-light-blue"></div>
                        <div className="pokedex-light pokedex-light-red"></div>
                        <div className="pokedex-light pokedex-light-yellow"></div>
                    </div>

                    <div className="text-center top-button-container">
                        <button
                            className="pokedex-button pokedex-button-blue stats-button"
                            onClick={(e) => { e.stopPropagation(); handleCardFlip(); }}
                        >
                            View Stats
                        </button>
                    </div>

                    <div className="pokemon-display-screen">
                        <div className="pokemon-id">#{details.id}</div>
                        <div className="pokemon-image-container">
                            <img
                                src={details.sprites.other['official-artwork']?.front_default || details.sprites.front_default}
                                alt={details.name}
                                className="pokemon-image"
                            />
                        </div>
                        <div className="pokemon-name">{details.name}</div>

                        <div className="d-flex gap-2 justify-content-center mb-2">
                            {details.types.map(typeInfo => (
                                <span
                                    key={typeInfo.type.name}
                                    className={`badge ${getTypeClass(typeInfo.type.name)}`}
                                >
                                {typeInfo.type.name}
                            </span>
                            ))}
                        </div>
                        <div className="mb-1 d-flex justify-content-center gap-3">
                            <span><strong>Height:</strong> {(details.height / 10).toFixed(1)}m</span>
                            <span><strong>Weight:</strong> {(details.weight / 10).toFixed(1)}kg</span>
                        </div>

                        <div className="description-container">
                            <p className="mb-0">{getEnglishDescription()}</p>
                        </div>
                    </div>

                    <div className="pokedex-buttons"></div>
                </div>

                <div className="flip-card-face flip-card-back">
                    <div className="pokedex-lights">
                        <div className="pokedex-light pokedex-light-red"></div>
                        <div className="pokedex-light pokedex-light-green"></div>
                    </div>
                    <div className="text-center top-button-container">
                        <button
                            className="pokedex-button"
                            onClick={(e) => { e.stopPropagation(); handleCardFlip(); }}
                        >
                            Back to Info
                        </button>
                    </div>

                    <div className="pokemon-display-screen compact-stats">
                        <div className="pokemon-id">#{details.id}</div>
                        <div className="pokemon-name">{details.name}</div>

                        <div className="d-flex gap-2 justify-content-center mb-2">
                            {details.types.map(typeInfo => (
                                <span
                                    key={typeInfo.type.name}
                                    className={`badge ${getTypeClass(typeInfo.type.name)}`}
                                >
                                {typeInfo.type.name}
                            </span>
                            ))}
                        </div>

                        <div className="stat-container">
                            <h6 className="mb-1 stat-label">Base Stats</h6>
                            {details.stats.map(stat => (
                                <div key={stat.stat.name} className="mb-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="stat-label compact-label">{stat.stat.name.replace("-", " ").replace("special-", "sp. ")}</span>
                                        <span className="stat-value">{stat.base_stat}</span>
                                    </div>
                                    <div className="stat-progress compact-progress">
                                        <div
                                            className={`stat-bar ${stat.base_stat > 70 ? 'bg-success' : stat.base_stat < 50 ? 'bg-danger' : 'bg-warning'}`}
                                            style={{ width: `${calculateStatPercentage(stat.base_stat)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pokedex-buttons"></div>

                    <div className="pokedex-speaker">
                        <div className="speaker-line"></div>
                        <div className="speaker-line"></div>
                        <div className="speaker-line"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PokemonItem;