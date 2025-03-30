const API_URL = "https://pokeapi.co/api/v2";

export const fetchPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
    return [];
  }
};
export const fetchPokemonDetails = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    return {};
  }
};
