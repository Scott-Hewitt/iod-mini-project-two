import {useEffect, useState} from "react";

const TypeCombinationFilter = ({ onTypeCombinationChange }) => {
    const [types, setTypes] = useState([]);
    const [firstType, setFirstType] = useState("");
    const [secondType, setSecondType] = useState("");

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/type/");
                const data = await response.json();
                setTypes(data.results); // List of types
            } catch (error) {
                console.error("Error fetching types:", error);
            }
        };

        fetchTypes();
    }, []);

    const handleTypeCombinationChange = () => {
        onTypeCombinationChange({ firstType, secondType });
    };
    let styles = {
        select: {
            margin: "10px",
            padding: "8px 12px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ddd",
        },
    };

    return (
        <div>
            <label htmlFor="first-type-select">First Type:</label>
            <select
                id="first-type-select"
                value={firstType}
                onChange={(e) => {
                    setFirstType(e.target.value);
                    handleTypeCombinationChange();
                }}
                style={styles.select}
            >
                <option value="">Any Type</option>
                {types.map((type) => (
                    <option key={type.name} value={type.name}>
                        {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                    </option>
                ))}
            </select>

            <label htmlFor="second-type-select">Second Type:</label>
            <select
                id="second-type-select"
                value={secondType}
                onChange={(e) => {
                    setSecondType(e.target.value);
                    handleTypeCombinationChange();
                }}
                style={styles.select}
            >
                <option value="">Any Type</option>
                {types.map((type) => (
                    <option key={type.name} value={type.name}>
                        {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TypeCombinationFilter;