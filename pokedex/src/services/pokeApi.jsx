export const fetchPokemonList = async (limit = 1010) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
    throw error;
  }
};

export const fetchPokemonByType = async (typeUrl) => {
  try {
    const response = await fetch(typeUrl);
    const data = await response.json();
    return data.pokemon.map(p => p.pokemon);
  } catch (error) {
    console.error("Error fetching Pokémon by type:", error);
    throw error;
  }
};

export const fetchPokemonByGeneration = async (generationUrl) => {
  try {
    const response = await fetch(generationUrl);
    const data = await response.json();
    return data.pokemon_species;
  } catch (error) {
    console.error("Error fetching Pokémon by generation:", error);
    throw error;
  }
};
export const fetchPokemonSpecies = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokémon species:", error);
    throw error;
  }
};

export const fetchPokemonByRegion = async (regionUrl) => {
  try {
    const response = await fetch(regionUrl);
    const regionData = await response.json();

    // Get the main generation associated with this region
    const generationResponse = await fetch(regionData.main_generation.url);
    const generationData = await generationResponse.json();

    return generationData.pokemon_species;
  } catch (error) {
    console.error("Error fetching Pokémon by region:", error);
    throw error;
  }
};

export const fetchPokemonByEggGroup = async (eggGroupUrl) => {
  try {
    const response = await fetch(eggGroupUrl);
    const data = await response.json();
    return data.pokemon_species;
  } catch (error) {
    console.error("Error fetching Pokémon by egg group:", error);
    throw error;
  }
};
export const fetchPokemonWithDescription = async (id) => {
  try {
    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemonData = await pokemonResponse.json();

    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const speciesData = await speciesResponse.json();

    return {
      pokemon: pokemonData,
      species: speciesData
    };
  } catch (error) {
    console.error("Error fetching complete Pokémon data:", error);
    throw error;
  }
};
