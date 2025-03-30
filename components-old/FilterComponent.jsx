
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const FilterComponent = ({
                             filterType,
                             filterLabel,
                             options,
                             selectedValue,
                             onFilterChange,
                             placeholder = "Select..."
                         }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [filterOptions, setFilterOptions] = useState([]);
    const selectRef = useRef(null);

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

    useEffect(() => {
        const loadOptions = async () => {
            setIsLoading(true);
            try {
                if (Array.isArray(options)) {
                    setFilterOptions(options);
                }
                else if (typeof options === 'function') {
                    let fetchedOptions = await options();

                    if (filterType === "type" && Array.isArray(fetchedOptions)) {
                        fetchedOptions = fetchedOptions.map(option => {
                            if (typeof option === "string") {
                                return {
                                    value: option,
                                    label: option.charAt(0).toUpperCase() + option.slice(1),
                                    color: typeColors[option.toLowerCase()] || typeColors.default
                                };
                            } else if (option.name) {
                                return {
                                    value: option.url || option.value || option.name,
                                    label: option.name.charAt(0).toUpperCase() + option.name.slice(1),
                                    color: typeColors[option.name.toLowerCase()] || typeColors.default
                                };
                            } else {
                                const typeName = option.label?.toLowerCase() ||
                                    option.value?.toLowerCase() ||
                                    "";
                                return {
                                    ...option,
                                    color: typeColors[typeName] || option.color || typeColors.default
                                };
                            }
                        });
                    }

                    setFilterOptions(fetchedOptions);
                }
            } catch (error) {
                console.error(`Error loading ${filterType} options:`, error);
            } finally {
                setIsLoading(false);
            }
        };

        loadOptions();
    }, [filterType, options]);

    const handleChange = (e) => {
        const value = e.target.value;

        let displayLabel = "";

        const selectedOption = filterOptions.find(option =>
            (option.value || option) === value
        );

        if (selectedOption) {
            displayLabel = selectedOption.label ||
                (typeof selectedOption === 'string' ? selectedOption : value);
        } else {
            displayLabel = value;
        }

        onFilterChange(filterType, value, `${filterLabel}: ${displayLabel}`, value !== "");
    };

    useEffect(() => {
        if (filterType === "type" && selectRef.current) {
            const applyTypeColors = () => {
                const optionElements = selectRef.current.querySelectorAll('option');

                filterOptions.forEach((option, index) => {
                    if (index + 1 < optionElements.length && option.color) {
                        optionElements[index + 1].style.backgroundColor = option.color;
                        optionElements[index + 1].style.color = "#fff";
                    }
                });
            };

            applyTypeColors();
            selectRef.current.addEventListener('focus', applyTypeColors);
            selectRef.current.addEventListener('mouseenter', applyTypeColors);

            return () => {
                if (selectRef.current) {
                    selectRef.current.removeEventListener('focus', applyTypeColors);
                    selectRef.current.removeEventListener('mouseenter', applyTypeColors);
                }
            };
        }
    }, [filterOptions, filterType]);

    return (
        <div className="filter-component">
            <select
                ref={selectRef}
                className="form-select"
                value={selectedValue}
                onChange={handleChange}
                disabled={isLoading}
                aria-label={`Filter by ${filterType}`}
            >
                <option value="">{isLoading ? "Loading..." : placeholder}</option>
                {filterOptions.map((option) => (
                    <option
                        key={option.value || option}
                        value={option.value || option}
                        data-color={filterType === "type" && option.color ? option.color : ""}
                    >
                        {option.label || option}
                    </option>
                ))}
            </select>
        </div>
    );
};

FilterComponent.propTypes = {
    filterType: PropTypes.string.isRequired,
    filterLabel: PropTypes.string.isRequired,
    options: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func
    ]).isRequired,
    selectedValue: PropTypes.string,
    onFilterChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string
};

export default FilterComponent;