import React, { useState, useEffect, useCallback } from "react";
import { fetchPokemonList, fetchPokemonByType, fetchPokemonByGeneration,
  fetchPokemonByRegion, fetchPokemonByEggGroup } from "../services/pokeApi.jsx";
import PokemonItem from "./PokemonItem";
import TypeFilter from "./TypeFilter";
import GenerationFilter from "./GenerationFilter";
import RegionFilter from "./RegionFilter";
import EggGroupFilter from "./EggGroupFilter";
import SearchFilter from "./SearchFilter";
import FilterTags from "./FilterTags";
import Pagination from "./Pagination";

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedEggGroup, setSelectedEggGroup] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonPerPage = 21;

  const [activeFilters, setActiveFilters] = useState({
    search: { active: false, label: "" },
    type: { active: false, label: "" },
    generation: { active: false, label: "" },
    region: { active: false, label: "" },
    eggGroup: { active: false, label: "" }
  });

  useEffect(() => {
    const loadInitialPokemon = async () => {
      setInitialLoading(true);
      try {
        const allPokemon = await fetchPokemonList();
        setPokemonList(allPokemon);
        setFilteredPokemon(allPokemon);
        setError(null);
      } catch (err) {
        setError("Failed to load Pokémon");
        console.error("Error loading initial Pokémon list:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialPokemon();
  }, []);

  useEffect(() => {
    setActiveFilters((prev) => ({
      ...prev,
      search: {
        active: searchValue !== "",
        label: `Search: ${searchValue}`
      }
    }));
    setCurrentPage(1);
  }, [searchValue]);

  const handleFilterChange = useCallback((filterType, label, active) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: { active, label }
    }));
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      if (!pokemonList.length) return;

      setLoading(true);
      try {
        let results = [...pokemonList];

        if (selectedType) {
          const typeFiltered = await fetchPokemonByType(selectedType);
          const typeFilteredNames = new Set(typeFiltered.map(p => p.name));
          results = results.filter(p => typeFilteredNames.has(p.name));
        }

        if (selectedGeneration) {
          const genFiltered = await fetchPokemonByGeneration(selectedGeneration);
          const genFilteredNames = new Set(genFiltered.map(p => p.name));
          results = results.filter(p => genFilteredNames.has(p.name));
        }

        if (selectedRegion) {
          const regionFiltered = await fetchPokemonByRegion(selectedRegion);
          const regionFilteredNames = new Set(regionFiltered.map(p => p.name));
          results = results.filter(p => regionFilteredNames.has(p.name));
        }

        if (selectedEggGroup) {
          const eggGroupFiltered = await fetchPokemonByEggGroup(selectedEggGroup);
          const eggGroupFilteredNames = new Set(eggGroupFiltered.map(p => p.name));
          results = results.filter(p => eggGroupFilteredNames.has(p.name));
        }

        if (searchValue) {
          const searchLower = searchValue.toLowerCase();
          results = results.filter(pokemon => {
            const idMatch = pokemon.url.match(/\/(\d+)\/$/);
            const pokemonId = idMatch ? idMatch[1] : "";

            return (
                pokemon.name.toLowerCase().includes(searchLower) ||
                pokemonId === searchValue
            );
          });
        }

        setFilteredPokemon(results);
      } catch (err) {
        console.error("Error applying filters:", err);
        setError("Error filtering Pokémon");
      } finally {
        setLoading(false);
      }
    };

    applyFilters();
  }, [pokemonList, selectedType, selectedGeneration, selectedRegion, selectedEggGroup, searchValue]);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    handleFilterChange("type", `Type: ${type}`, type !== "");
  };

  const handleGenerationChange = (generation) => {
    setSelectedGeneration(generation);
    handleFilterChange("generation", `Generation: ${generation}`, generation !== "");
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    handleFilterChange("region", `Region: ${region}`, region !== "");
  };

  const handleEggGroupChange = (eggGroup) => {
    setSelectedEggGroup(eggGroup);
    handleFilterChange("eggGroup", `Egg Group: ${eggGroup}`, eggGroup !== "");
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const removeFilter = (filterType) => {
    switch (filterType) {
      case "search":
        setSearchValue("");
        break;
      case "type":
        setSelectedType("");
        handleFilterChange("type", "", false);
        break;
      case "generation":
        setSelectedGeneration("");
        handleFilterChange("generation", "", false);
        break;
      case "region":
        setSelectedRegion("");
        handleFilterChange("region", "", false);
        break;
      case "eggGroup":
        setSelectedEggGroup("");
        handleFilterChange("eggGroup", "", false);
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setSearchValue("");
    setSelectedType("");
    setSelectedGeneration("");
    setSelectedRegion("");
    setSelectedEggGroup("");
    setActiveFilters({
      search: { active: false, label: "" },
      type: { active: false, label: "" },
      generation: { active: false, label: "" },
      region: { active: false, label: "" },
      eggGroup: { active: false, label: "" }
    });
  };
  const indexOfLastPokemon = currentPage * pokemonPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonPerPage;
  const currentPokemon = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);
  const totalPages = Math.ceil(filteredPokemon.length / pokemonPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (initialLoading) {
    return (
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading Pokémon data...</p>
        </div>
    );
  }

  if (error && !filteredPokemon.length) {
    return (
        <div className="container text-center py-5">
          <i className="bi bi-exclamation-triangle text-warning fs-1"></i>
          <p className="mt-3">{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
    );
  }

  const hasActiveFilters = Object.values(activeFilters).some(filter => filter.active);

  return (
      <div className="container-fluid py-4">
        <h2 className="text-center mb-4">Pokémon Database</h2>

        <div className="row mb-4 g-3">
          <div className="col-12 col-md-3">
            <SearchFilter
                onSearch={handleSearchChange}
                value={searchValue}
            />
          </div>
          <div className="col-6 col-md-2">
            <TypeFilter
                selectedType={selectedType}
                onSelectType={handleTypeChange}
                onFilterChange={handleFilterChange}
            />
          </div>
          <div className="col-6 col-md-2">
            <GenerationFilter
                selectedGeneration={selectedGeneration}
                onSelectGeneration={handleGenerationChange}
                onFilterChange={handleFilterChange}
            />
          </div>
          <div className="col-6 col-md-2">
            <RegionFilter
                selectedRegion={selectedRegion}
                onSelectRegion={handleRegionChange}
                onFilterChange={handleFilterChange}
            />
          </div>
          <div className="col-6 col-md-3">
            <EggGroupFilter
                selectedEggGroup={selectedEggGroup}
                onSelectEggGroup={handleEggGroupChange}
                onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        {hasActiveFilters && (
            <FilterTags
                activeFilters={activeFilters}
                onClearFilter={removeFilter}
                onClearAll={clearAllFilters}
            />
        )}

        {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Applying filters...</p>
            </div>
        ) : (
            <>
              {filteredPokemon.length === 0 ? (
                  <div className="text-center py-4">
                    <p>No Pokémon found matching your filters.</p>
                    <button
                        className="btn btn-outline-primary"
                        onClick={clearAllFilters}
                    >
                      Clear all filters
                    </button>
                  </div>
              ) : (
                  <>
                    <p className="mb-3 text-muted">
                      Showing {indexOfFirstPokemon + 1} - {Math.min(indexOfLastPokemon, filteredPokemon.length)} of {filteredPokemon.length} Pokémon
                    </p>

                    <div className="pokemon-grid">
                      {currentPokemon.map((pokemon) => (
                          <div key={pokemon.name}>
                            <PokemonItem pokemon={pokemon} />
                          </div>
                      ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                  </>
              )}
            </>
        )}
      </div>
  );
};

export default PokemonList;