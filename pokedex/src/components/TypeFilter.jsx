import React, { useState, useEffect } from "react";

const TypeFilter = ({ onTypeChange }) => {
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/type");
        const data = await response.json();
        const standardTypes = data.results.filter(
            type => !["unknown", "shadow"].includes(type.name)
        );
        setTypes(standardTypes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching types:", error);
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
    onTypeChange(type);
  };
  const getTypeColor = (type) => {
    const typeColors = {
      normal: "#A8A77A",
      fire: "#EE8130",
      water: "#6390F0",
      electric: "#F7D02C",
      grass: "#7AC74C",
      ice: "#96D9D6",
      fighting: "#C22E28",
      poison: "#A33EA1",
      ground: "#E2BF65",
      flying: "#A98FF3",
      psychic: "#F95587",
      bug: "#A6B91A",
      rock: "#B6A136",
      ghost: "#735797",
      dragon: "#6F35FC",
      dark: "#705746",
      steel: "#B7B7CE",
      fairy: "#D685AD",
      default: "#777777"
    };

    return typeColors[type] || typeColors.default;
  };

  return (
      <div className="card filter-card h-100 border-0">
        <div className="card-body">
          <h5 className="card-title filter-label">Type Filter</h5>
          {loading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
          ) : (
              <>
                <select
                    className="form-select"
                    value={selectedType}
                    onChange={handleTypeChange}
                    aria-label="Select Type"
                >
                  <option value="">All Types</option>
                  {types.map((type) => (
                      <option
                          key={type.name}
                          value={type.url}
                          style={{
                            backgroundColor: getTypeColor(type.name),
                            color: "#fff"
                          }}
                      >
                        {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                      </option>
                  ))}
                </select>
                <small className="text-muted mt-2 d-block">
                  Filter Pokémon by their elemental type
                </small>
              </>
          )}
        </div>
      </div>
  );
};

export default TypeFilter;