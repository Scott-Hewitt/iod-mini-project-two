import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import PokemonList from "./components/PokemonList.jsx";

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="page-background">
            <div className="pokedex-elements">
                <div className="pokedex-background">
                    <PokemonList />
                </div>
            </div>
        </div>
    );
}

export default App;