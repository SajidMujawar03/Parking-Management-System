import { useState } from 'react';
import './App.css';
import './index.css';
import Layout from './layout/Layout.jsx';
import LocationFinder from './Location/LocationFinder'; // Import the LocationFinder component

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Layout />
      {/* Render LocationFinder globally here */}
      {/* <LocationFinder /> */}
    </>
  );
}

export default App;
