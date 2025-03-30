import React from "react";
import PropTypes from "prop-types";
import FilterComponent from "./FilterComponent";
import {
    fetchPokemonByType,
    fetchPokemonByGeneration,
    fetchPokemonByRegion,
    fetchPokemonByEggGroup
} from "../pokedex/src/services/pokeApi.jsx";

const FilterContainer = ({
                             filters,
                             onFilterChange,
                             onSearchChange
                         }) => {
    const {
        type: selectedType,
        generation: selectedGeneration,
        region: selectedRegion,
        eggGroup: selectedEggGroup,
        search: searchValue
    } = filters;

    const handleFilterChange = (filterType, value, label, active) => {
        onFilterChange(filterType, value, label, active);
    };

    const handleSearchInputChange = (e) => {
        onSearchChange(e.target.value);
    };

    return (
        <div className="row mb-4 g-3">
            <div className="col-12 col-md-3">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or ID"
                        value={searchValue}
                        onChange={handleSearchInputChange}
                        aria-label="Search Pokémon"
                    />
                    {searchValue && (
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => onSearchChange("")}
                        >
                            <i className="bi bi-x"></i>
                        </button>
                    )}
                </div>
            </div>

            <div className="col-6 col-md-2">
                <FilterComponent
                    filterType="type"
                    filterLabel="Type"
                    options={() => fetchPokemonByType()}
                    selectedValue={selectedType}
                    onFilterChange={handleFilterChange}
                    placeholder="Select type"
                />
            </div>

            <div className="col-6 col-md-2">
                <FilterComponent
                    filterType="generation"
                    filterLabel="Generation"
                    options={() => fetchPokemonByGeneration()}
                    selectedValue={selectedGeneration}
                    onFilterChange={handleFilterChange}
                    placeholder="Select generation"
                />
            </div>

            <div className="col-6 col-md-2">
                <FilterComponent
                    filterType="region"
                    filterLabel="Region"
                    options={() => fetchPokemonByRegion()}
                    selectedValue={selectedRegion}
                    onFilterChange={handleFilterChange}
                    placeholder="Select region"
                />
            </div>

            <div className="col-6 col-md-3">
                <FilterComponent
                    filterType="eggGroup"
                    filterLabel="Egg Group"
                    options={() => fetchPokemonByEggGroup()}
                    selectedValue={selectedEggGroup}
                    onFilterChange={handleFilterChange}
                    placeholder="Select egg group"
                />
            </div>
        </div>
    );
};

FilterContainer.propTypes = {
    filters: PropTypes.shape({
        type: PropTypes.string,
        generation: PropTypes.string,
        region: PropTypes.string,
        eggGroup: PropTypes.string,
        search: PropTypes.string
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired
};

export default FilterContainer;