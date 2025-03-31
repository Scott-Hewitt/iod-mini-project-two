import React from "react";

const SearchFilter = ({ onSearch, value }) => {
    return (
        <div className="input-group">
        <i className="bi bi-search"></i>
            <input
                type="text"
                className="form-control"
                placeholder="Search by name or Pokémon number..."
                value={value}
                onChange={(e) => onSearch(e.target.value)}
            />
            {value && (
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => onSearch("")}
                >
                    <i className="bi bi-x"></i>
                </button>
            )}
        </div>
    );
};

export default SearchFilter;