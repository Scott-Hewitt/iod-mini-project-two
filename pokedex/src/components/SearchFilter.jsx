import React from "react";

const SearchFilter = ({ onSearch, value }) => {
    const handleSearchChange = (e) => {
        onSearch(e.target.value);
    };

    return (
        <div className="card filter-card h-100 border-0">
            <div className="card-body">
                <h5 className="card-title filter-label">Search Pokémon</h5>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or ID"
                        value={value}
                        onChange={handleSearchChange}
                    />
                    {value && (
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => onSearch("")}
                        >
                            ×
                        </button>
                    )}
                </div>
                <small className="text-muted mt-2 d-block">
                    Enter Pokémon name or ID number
                </small>
            </div>
        </div>
    );
};

export default SearchFilter;