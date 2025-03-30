import React from "react";

const FilterTags = ({ activeFilters, onClearFilter, onClearAll }) => {
    const filterInfo = Object.entries(activeFilters).filter(([_, info]) => info.active);

    if (filterInfo.length === 0) return null;

    return (
        <div className="mb-4">
            <div className="d-flex align-items-center mb-2">
                <h6 className="mb-0 me-2">Active filters:</h6>
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={onClearAll}
                >
                    Clear all
                </button>
            </div>
            <div className="d-flex flex-wrap gap-2">
                {filterInfo.map(([key, info]) => (
                    <span key={key} className="badge bg-primary d-flex align-items-center">
            {info.label}
                        <button
                            className="btn-close btn-close-white ms-2"
                            style={{ fontSize: "0.5rem" }}
                            onClick={() => onClearFilter(key)}
                            aria-label="Close"
                        ></button>
          </span>
                ))}
            </div>
        </div>
    );
};

export default FilterTags;