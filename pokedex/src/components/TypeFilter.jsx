import React, { useState, useEffect } from "react";

const TypeFilter = ({ selectedType, onSelectType, onFilterChange }) => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchTypes = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://pokeapi.co/api/v2/type");
        const data = await response.json();
        setTypes(data.results.filter(type =>
            type.name !== "unknown" && type.name !== "shadow"
        ));
      } catch (error) {
        console.error("Error fetching types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    if (selectedType && types.length > 0) {
      const type = types.find(t => t.url === selectedType);
      if (type) {
        setDisplayName(type.name.charAt(0).toUpperCase() + type.name.slice(1));
        onFilterChange("type", type.name.charAt(0).toUpperCase() + type.name.slice(1), true);
      }
    } else {
      setDisplayName("");
      onFilterChange("type", "", false);
    }
  }, [selectedType, types, onFilterChange]);

  return (
      <div className="card h-100">
        <div className="card-header bg-info text-white">
          <i className="bi bi-lightning-charge-fill me-2"></i>Type
        </div>
        <div className="card-body">
          <select
              className="form-select"
              value={selectedType}
              onChange={(e) => onSelectType(e.target.value)}
              disabled={loading}
          >
            <option value="">All Types</option>
            {types.map((type) => (
                <option key={type.name} value={type.url}>
                  {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                </option>
            ))}
          </select>
        </div>
      </div>
  );
};

export default TypeFilter;