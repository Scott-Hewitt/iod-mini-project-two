import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PokemonList from "./components/PokemonList.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
   <div>
       <PokemonList />
   </div>
  )
}

export default App
