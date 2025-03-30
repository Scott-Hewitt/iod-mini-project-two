import React, { useState, useEffect } from "react";
import { fetchPokemonList } from "../services/pokeApi.jsx";
import PokemonItem from "./PokemonItem";
import TypeFilter from "./TypeFilter";
import GenerationFilter from "./GenerationFilter";

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPokemon = async () => {
      setLoading(true);
      const data = await fetchPokemonList(20);
      setPokemonList(data);
      setFilteredPokemon(data);
      setLoading(false);
    };

    loadPokemon();
  }, []);

  const handleTypeChange = async (type) => {
    if (!type) {
      setFilteredPokemon(pokemonList);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      const data = await response.json();
      const filteredPokemonData = data.pokemon.map((p) => ({
        name: p.pokemon.name,
        url: p.pokemon.url,
      }));
      setFilteredPokemon(filteredPokemonData);
    } catch (error) {
      console.error("Error filtering Pokémon by type:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerationChange = async (generationUrl) => {
    if (!generationUrl) {
      setFilteredPokemon(pokemonList);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(generationUrl);
      const data = await response.json();
      const filteredPokemonData = data.pokemon_species.map((species) => ({
        name: species.name,
        url: `https://pokeapi.co/api/v2/pokemon/${species.name}`,
      }));
      setFilteredPokemon(filteredPokemonData);
    } catch (error) {
      console.error("Error filtering Pokémon by generation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
        <h1>Pokedex</h1>
        <TypeFilter onTypeChange={handleTypeChange} />
        <GenerationFilter onGenerationChange={handleGenerationChange} />
        {loading ? (
            <p>Loading Pokémon...</p>
        ) : (
            <div style={styles.gridContainer}>
              {filteredPokemon.map((pokemon, index) => (
                  <PokemonItem
                      key={index}
                      pokemon={pokemon}
                  />
              ))}
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
};

export default PokemonList;