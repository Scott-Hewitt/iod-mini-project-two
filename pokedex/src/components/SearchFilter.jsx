import {useState} from "react";

const SearchFilter = ({ onSearchChange }) => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = () => {
        onSearchChange(searchValue.trim().toLowerCase());
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleSearch} style={styles.button}>
                Search
            </button>
        </div>
    );
};

const styles = {
    input: {
        margin: "10px",
        padding: "8px 12px",
        fontSize: "16px",
        borderRadius: "4px",
        border: "1px solid #ddd",
    },
    button: {
        padding: "8px 16px",
        fontSize: "16px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#007bff",
        color: "#fff",
        cursor: "pointer",
    },
};

export default SearchFilter;