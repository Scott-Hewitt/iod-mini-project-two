import React, { useEffect, useState } from "react";
import { fetchPokemonDetails } from "../services/pokeApi.jsx";

const getTypeIconUrl = (type) => `/assets/types/${type}.png`;

const PokemonItem = ({ pokemon, onClick }) => {
    const [pokemonData, setPokemonData] = useState(null);

    useEffect(() => {
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
                {pokemonData.flavorText}
            </p>
            <div style={styles.types}>
                <strong>Types:</strong>
                {pokemonData.types?.map((typeName) => (
                    <div key={typeName} style={styles.type}>
                        <img
                            src={getTypeIconUrl(typeName)}
                            alt={typeName}
                            style={styles.typeIcon}
                        />
                    </div>
                ))}
            </div>
            <p style={styles.stats}>
                <strong>Stats:</strong>
                {pokemonData.stats?.map((stat) => (
                    <span style={styles.stat} key={stat.stat.name}>
            {stat.stat.name}: {stat.base_stat}{" "}
          </span>
                ))}
            </p>
        </div>
    );
};
const styles = {
    card: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        textAlign: "center",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
        backgroundColor: "#fff",
        maxWidth: "300px",
        margin: "10px auto",
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
        marginBottom: "10px",
    },
    types: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "10px",
        fontSize: "14px",
        color: "#333",
    },
    type: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
        padding: "5px",
        borderRadius: "8px",
    },
    typeIcon: {
        width: "30px",
        height: "30px",
    },
    stats: {
        fontSize: "12px",
        color: "#666",
        textAlign: "left",
    },
    stat: {
        display: "block",
    },
};

export default PokemonItem;