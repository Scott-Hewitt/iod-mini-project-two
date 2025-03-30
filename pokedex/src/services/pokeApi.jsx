const API_URL = "https://pokeapi.co/api/v2";

export const fetchPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(
        `${API_URL}/pokemon?limit=${limit}&offset=${offset}`
    );
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
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();

    return {
      ...data,
      flavorText:
          speciesData.flavor_text_entries.find(
              (entry) => entry.language.name === "en"
          )?.flavor_text || "No description available.",
      types: data.types.map((typeInfo) => typeInfo.type.name),
    };
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
    return {};
  }
};