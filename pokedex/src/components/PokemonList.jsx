import React, { useState, useEffect } from "react";
import { fetchPokemonList } from "../services/pokeApi.jsx";
import PokemonItem from "./PokemonItem";
import TypeFilter from "./TypeFilter";
import GenerationFilter from "./GenerationFilter";
import RegionFilter from "./RegionFilter";
import EggGroupFilter from "./EggGroupFilter";
import SearchFilter from "./SearchFilter";

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState(0);

  const [selectedType, setSelectedType] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedEggGroup, setSelectedEggGroup] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonPerPage = 20;

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setInitialLoading(true);
        const data = await fetchPokemonList(1025);
        setPokemonList(data);
        setFilteredPokemon(data);
        setError(null);
      } catch (err) {
        console.error("Error loading Pokémon:", err);
        setError("Failed to load Pokémon data. Please try again later.");
      } finally {
        setInitialLoading(false);
        setLoading(false);
      }
    };

    loadPokemon();
  }, []);

  useEffect(() => {
    let count = 0;
    if (selectedType) count++;
    if (selectedGeneration) count++;
    if (selectedRegion) count++;
    if (selectedEggGroup) count++;
    if (searchValue) count++;
    setActiveFilters(count);

    setCurrentPage(1);
    applyFilters()

  }, [searchValue, selectedType, selectedGeneration, selectedRegion, selectedEggGroup]);

  useEffect(() => {
    if (searchValue !== "") {
      const delaySearch = setTimeout(() => {
        applyFilters();
      }, 500);

      return () => clearTimeout(delaySearch);
    }
  }, [searchValue]);

  useEffect(() => {
    if (selectedType || selectedGeneration || selectedRegion || selectedEggGroup) {
      applyFilters();
    }
  }, [selectedType, selectedGeneration, selectedRegion, selectedEggGroup]);

  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    let filteredResults = [...pokemonList];
    if (searchValue && searchValue.trim() !== "") {
      const searchLower = searchValue.toLowerCase().trim();

      filteredResults = filteredResults.filter((pokemon) => {
        const urlParts = pokemon.url.split('/');
        const pokemonId = urlParts[urlParts.length - 2];

        return (
            pokemon.name.toLowerCase().includes(searchLower) ||
            pokemonId.includes(searchLower)
        );
      });
    }
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
          const genResponse = await fetch(regionData.main_generation.url);
          const genData = await genResponse.json();
          const genPokemonNames = genData.pokemon_species.map(p => p.name);

          filteredResults = filteredResults.filter((p) =>
              genPokemonNames.includes(p.name)
          );
        }
      }

      if (selectedEggGroup) {
        const response = await fetch(selectedEggGroup);
        const eggGroupData = await response.json();
        const eggGroupPokemonNames = eggGroupData.pokemon_species.map(p => p.name);

        filteredResults = filteredResults.filter((p) =>
            eggGroupPokemonNames.includes(p.name)
        );
      }

      if (selectedType) {
        const response = await fetch(selectedType);
        const typeData = await response.json();
        const typePokemons = typeData.pokemon.map((p) => ({
          name: p.pokemon.name,
          url: p.pokemon.url,
        }));

        filteredResults = filteredResults.filter((pokemon) =>
            typePokemons.some((typePokemon) => typePokemon.name === pokemon.name)
        );
      }

      setFilteredPokemon(filteredResults);
    } catch (err) {
      console.error("Error applying filters:", err);
      setError("Failed to apply filters. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const clearAllFilters = () => {
    setSelectedType("");
    setSelectedGeneration("");
    setSelectedRegion("");
    setSelectedEggGroup("");
    setSearchValue("");
    setFilteredPokemon(pokemonList);
    setActiveFilters(0);
  };

  const indexOfLastPokemon = currentPage * pokemonPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonPerPage;
  const currentPokemon = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);
  const totalPages = Math.ceil(filteredPokemon.length / pokemonPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  return (
      <div className="container py-4">
        <h1 className="text-center py-4 my-2">
          <i className="bi bi-circle-fill text-danger me-2" style={{ fontSize: "0.5em", verticalAlign: "middle" }}></i>
          Pokédex
          <i className="bi bi-circle-fill text-danger ms-2" style={{ fontSize: "0.5em", verticalAlign: "middle" }}></i>
        </h1>

        <div className="row mb-4">
          <div className="col-md-12">
            <SearchFilter onSearch={setSearchValue} value={searchValue} />
          </div>
        </div>

        <div className="row mb-4 g-3">
          <div className="col-md-3">
            <TypeFilter selectedType={selectedType} onSelectType={setSelectedType} />
          </div>
          <div className="col-md-3">
            <GenerationFilter selectedGeneration={selectedGeneration} onSelectGeneration={setSelectedGeneration} />
          </div>
          <div className="col-md-3">
            <RegionFilter selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} />
          </div>
          <div className="col-md-3">
            <EggGroupFilter selectedEggGroup={selectedEggGroup} onSelectEggGroup={setSelectedEggGroup} />
          </div>
        </div>

        {activeFilters > 0 && (
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="filters-info">
                <span className="badge bg-primary me-2">{activeFilters} active filter(s)</span>
                {selectedType && <span className="badge bg-info me-2">Type</span>}
                {selectedGeneration && <span className="badge bg-success me-2">Generation</span>}
                {selectedRegion && <span className="badge bg-warning me-2">Region</span>}
                {selectedEggGroup && <span className="badge bg-danger me-2">Egg Group</span>}
                {searchValue && <span className="badge bg-secondary me-2">Search</span>}
              </div>
              <button className="btn btn-outline-danger btn-sm" onClick={clearAllFilters}>
                Clear All Filters <i className="bi bi-x-circle"></i>
              </button>
            </div>
        )}

        {initialLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading Pokémon data...</p>
            </div>
        ) : error ? (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
        ) : (
            <>
              {loading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-2">Applying filters...</span>
                  </div>
              ) : (
                  <>
                    {filteredPokemon.length === 0 ? (
                        <div className="alert alert-info" role="alert">
                          <i className="bi bi-info-circle-fill me-2"></i>
                          No Pokémon found with the selected filters. Try changing or clearing some filters.
                        </div>
                    ) : (
                        <div className="mb-4">
                          <p className="text-muted">
                            <i className="bi bi-list-ul me-2"></i>
                            Showing {indexOfFirstPokemon + 1}-{Math.min(indexOfLastPokemon, filteredPokemon.length)} of{" "}
                            {filteredPokemon.length} results
                          </p>
                        </div>
                    )}

                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                      {currentPokemon.map((pokemon) => (
                          <div className="col" key={pokemon.name}>
                            <PokemonItem pokemon={pokemon} />
                          </div>
                      ))}
                    </div>

                    {filteredPokemon.length > pokemonPerPage && (
                        <nav className="mt-5">
                          <ul className="pagination pagination-md justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                              <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                <i className="bi bi-chevron-left"></i>
                              </button>
                            </li>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                                if (i === 4) pageNum = totalPages;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                                if (i === 0) pageNum = 1;
                              } else {
                                pageNum = currentPage - 2 + i;
                                if (i === 0) pageNum = 1;
                                if (i === 4) pageNum = totalPages;
                              }

                              return (
                                  <li className={`page-item ${currentPage === pageNum ? "active" : ""}`} key={i}>
                                    <button className="page-link" onClick={() => paginate(pageNum)}>
                                      {pageNum}
                                    </button>
                                  </li>
                              );
                            })}

                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                              <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                <i className="bi bi-chevron-right"></i>
                              </button>
                            </li>
                          </ul>
                        </nav>
                    )}
                  </>
              )}
            </>
        )}
      </div>
  );
};

export default PokemonList;