import React, { useState, useEffect } from "react";

const TypeFilter = ({ onTypeChange }) => {
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/type");
        const data = await response.json();
        setTypes(data.results);
      } catch (error) {
        console.error("Error fetching Pokémon types:", error);
      }
    };

    fetchTypes();
  }, []);

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
    onTypeChange(type);
  };

  return (
    <div>
      <label htmlFor="type-select">Filter by Type:</label>
      <select
        id="type-select"
        value={selectedType}
        onChange={handleTypeChange}
        style={styles.select}
      >
        <option value="">All Types</option>
        {types.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

const styles = {
  select: {
    margin: "10px",
    padding: "8px 12px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
};

export default TypeFilter;