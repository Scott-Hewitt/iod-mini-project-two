import React, { useState, useEffect } from "react";
import { fetchPokemonList } from "../services/pokeApi.jsx";
import PokemonItem from "./PokemonItem";
import TypeFilter from "./TypeFilter";
import GenerationFilter from "./GenerationFilter";
import RegionFilter from "./RegionFilter";
import EggGroupFilter from "./EggGroupFilter";
import TypeCombinationFilter from "./TypeCombinationFilter";
import SearchFilter from "./SearchFilter";

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters state
  const [selectedType, setSelectedType] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedEggGroup, setSelectedEggGroup] = useState("");
  const [typeCombination, setTypeCombination] = useState({ firstType: "", secondType: "" });
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const loadPokemon = async () => {
      setLoading(true);
      const data = await fetchPokemonList(200);
      setPokemonList(data);
      setFilteredPokemon(data);
      setLoading(false);
    };

    loadPokemon();
  }, []);

  const applyFilters = async () => {
    setLoading(true);

    let filteredResults = pokemonList;

    try {
      if (selectedGeneration) {
        const response = await fetch(selectedGeneration);
        const generationData = await response.json();
        filteredResults = generationData.pokemon_species.map((species) => ({
          name: species.name,
          url: `https://pokeapi.co/api/v2/pokemon/${species.name}`,
        }));
      }
      if (selectedRegion) {
        const response = await fetch(selectedRegion);
        const regionData = await response.json();
        if (regionData.main_generation) {
          filteredResults = filteredResults.filter((p) =>
              regionData.main_generation.url.includes(p.name)
          );
        }
      }
      if (typeCombination.firstType || typeCombination.secondType) {
        const firstTypeResults = typeCombination.firstType
            ? await fetchTypePokemon(typeCombination.firstType)
            : filteredResults;

        const secondTypeResults = typeCombination.secondType
            ? await fetchTypePokemon(typeCombination.secondType)
            : filteredResults;

        filteredResults = filteredResults.filter(
            (p) =>
                firstTypeResults.some((typePokemon) => typePokemon.name === p.name) &&
                secondTypeResults.some((typePokemon) => typePokemon.name === p.name)
        );
      }
      if (selectedEggGroup) {
        const response = await fetch(selectedEggGroup);
        const eggGroupData = await response.json();
        const eggGroupPokemonNames = eggGroupData.pokemon_species.map((p) => p.name);

        filteredResults = filteredResults.filter((p) => eggGroupPokemonNames.includes(p.name));
      }
      if (selectedType) {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
        const typeData = await response.json();
        const typeFilteredResults = typeData.pokemon.map((p) => p.pokemon.name);

        filteredResults = filteredResults.filter((p) => typeFilteredResults.includes(p.name));
      }
      if (searchValue) {
        filteredResults = filteredResults.filter((p) => {
          return (
              p.name.toLowerCase().includes(searchValue) || p.url.split("/").slice(-2, -1)[0] === searchValue
          );
        });
      }
    } catch (error) {
      console.error("Error applying filters:", error);
    }

    setFilteredPokemon(filteredResults);
    setLoading(false);
  };

  const fetchTypePokemon = async (type) => {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await response.json();
    return data.pokemon.map((p) => p.pokemon);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    applyFilters();
  };

  const handleGenerationChange = (generationUrl) => {
    setSelectedGeneration(generationUrl);
    applyFilters();
  };

  const handleRegionChange = (regionUrl) => {
    setSelectedRegion(regionUrl);
    applyFilters();
  };

  const handleEggGroupChange = (eggGroupUrl) => {
    setSelectedEggGroup(eggGroupUrl);
    applyFilters();
  };

  const handleTypeCombinationChange = (combination) => {
    setTypeCombination(combination);
    applyFilters();
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
    applyFilters();
  };

  return (
      <div>
        <h1>Pokedex</h1>

        {/* Filters */}
        <SearchFilter onSearchChange={handleSearchChange} />
        <TypeFilter onTypeChange={handleTypeChange} />
        <GenerationFilter onGenerationChange={handleGenerationChange} />
        <RegionFilter onRegionChange={handleRegionChange} />
        <EggGroupFilter onEggGroupChange={handleEggGroupChange} />
        <TypeCombinationFilter onTypeCombinationChange={handleTypeCombinationChange} />

        {/* Pokémon List */}
        {loading ? (
            <p>Loading Pokémon...</p>
        ) : (
            <div style={styles.gridContainer}>
              {filteredPokemon.map((pokemon, index) => (
                  <PokemonItem key={index} pokemon={pokemon} />
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