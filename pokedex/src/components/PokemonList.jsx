import React, { useState, useEffect } from "react";
import { fetchPokemonList, fetchPokemonDetails } from "../services/pokeApi.jsx";
import PokemonItem from "./PokemonItem";

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const loadPokemon = async () => {
      const data = await fetchPokemonList(20);
      setPokemonList(data);
    };
    loadPokemon();
  }, []);

  const selectPokemon = async (url) => {
    const data = await fetchPokemonDetails(url);
    setSelectedPokemon(data);
  };

  return (
      <div>
        <h1>Pokedex</h1>
        <div style={styles.gridContainer}>
          {pokemonList.map((pokemon, index) => (
              <PokemonItem
                  key={index}
                  pokemon={pokemon}
                  onClick={() => selectPokemon(pokemon.url)}
              />
          ))}
        </div>


        {selectedPokemon && (
            <div style={styles.detailsContainer}>
              <h2>{selectedPokemon.name.toUpperCase()}</h2>
              <p>Base Experience: {selectedPokemon.base_experience}</p>
              <img
                  src={selectedPokemon.sprites?.front_default}
                  alt={selectedPokemon.name}
              />
            </div>
        )}
      </div>
  );
};

const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  detailsContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
};


export default PokemonList;