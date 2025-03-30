import React, { useEffect, useState } from "react";
import { fetchPokemonDetails } from "../services/pokeApi.jsx";

const PokemonItem = ({ pokemon, onClick }) => {
    const [pokemonData, setPokemonData] = useState(null);

    useEffect(() => {
        // Fetch details for each Pokémon to get image and description
        const loadPokemonDetails = async () => {
            const data = await fetchPokemonDetails(pokemon.url);
            setPokemonData(data);
        };
        loadPokemonDetails();
    }, [pokemon.url]);

    if (!pokemonData) return null;

    return (
        <div
            style={styles.card}
            onClick={onClick}
        >
            <img
                src={pokemonData.sprites?.front_default}
                alt={pokemon.name}
                style={styles.image}
            />
            <h2 style={styles.name}>{pokemon.name.toUpperCase()}</h2>
            <p style={styles.description}>
                Experience: {pokemonData.base_experience}
            </p>
        </div>
    );
};

// Styles for the individual Pokémon "card"
const styles = {
    card: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        textAlign: "center",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
    },
    image: {
        width: "100px",
        height: "100px",
        objectFit: "contain",
    },
    name: {
        fontSize: "16px",
        margin: "10px 0 5px",
    },
    description: {
        fontSize: "14px",
        color: "#555",
    },
    cardHover: {
        transform: "scale(1.05)",
    },
};

export default PokemonItem;