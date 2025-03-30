import {useEffect, useState} from "react";

const EggGroupFilter = ({ onEggGroupChange }) => {
    const [eggGroups, setEggGroups] = useState([]);
    const [selectedEggGroup, setSelectedEggGroup] = useState("");

    useEffect(() => {
        const fetchEggGroups = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/egg-group/");
                const data = await response.json();
                setEggGroups(data.results);
            } catch (error) {
                console.error("Error fetching egg groups:", error);
            }
        };

        fetchEggGroups();
    }, []);

    const handleEggGroupChange = (event) => {
        const eggGroup = event.target.value;
        setSelectedEggGroup(eggGroup);
        onEggGroupChange(eggGroup);
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
            <label htmlFor="egg-group-select">Filter by Egg Group:</label>
            <select
                id="egg-group-select"
                value={selectedEggGroup}
                onChange={handleEggGroupChange}
                style={styles.select}
            >
                <option value="">All Egg Groups</option>
                {eggGroups.map((eggGroup) => (
                    <option key={eggGroup.name} value={eggGroup.url}>
                        {eggGroup.name.charAt(0).toUpperCase() + eggGroup.name.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default EggGroupFilter;