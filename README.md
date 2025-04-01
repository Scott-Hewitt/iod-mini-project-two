# Pokédex App
## Overview
A modern, interactive Pokédex web application built with React that allows users to explore and discover Pokémon with detailed information, multiple filtering options, and a responsive user interface.
## Features
- **Comprehensive Pokémon Database**: Access information on hundreds of Pokémon from across all generations
- **Interactive Cards**: Flip cards to see detailed Pokémon information including stats, abilities, and descriptions
- **Multiple Filtering Options**:
    - Type filtering (Fire, Water, Grass, etc.)
    - Generation filtering
    - Region filtering
    - Egg Group filtering
    - Text search functionality

- **Visual Filter Tags**: See and remove active filters easily
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time API Integration**: Uses the PokéAPI to fetch current Pokémon data
- **Pagination**: Browse through the extensive Pokémon catalog with ease

## Technology Stack
- **React 19.0.0**: Modern frontend framework for building the user interface
- **Bootstrap 5.3.3**: For responsive and attractive UI components
- **Vite 6.2.0**: Fast development and build tool
- **React Text-to-Speech 1.4.3**: For audio pronunciation of Pokémon names
- **Custom CSS**: Enhanced styling for Pokémon type colors and card animations
- **RESTful API**: Integration with the PokéAPI for Pokémon data

## Getting Started
### Prerequisites
- Node.js (v16 or later recommended)
- npm or yarn package manager

### Installation
1. Clone the repository
``` bash
git clone https://github.com/yourusername/pokedex-app.git
cd pokedex-app
```
1. Install dependencies
``` bash
npm install
```
1. Start the development server
``` bash
npm run dev
```
1. Open your browser and navigate to [http://localhost:5173](http://localhost:5173)

## Usage
- **Browse Pokémon**: Scroll through the paginated list to discover Pokémon
- **Search**: Use the search bar to find specific Pokémon by name
- **Filter**: Select filters from the dropdown menus to narrow your search by type, generation, region or egg group
- **View Details**: Click on any Pokémon card to flip it and reveal detailed information
- **Manage Filters**: Use the filter tags to see active filters and remove them with a click
