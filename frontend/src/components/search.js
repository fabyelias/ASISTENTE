import React, { useState } from 'react';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const response = await fetch(`https://nombre-de-tu-aplicacion.herokuapp.com/api/google/search?query=${query}`);
        const data = await response.json();
        setResults(data);
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar en Google"
                />
                <button type="submit">Buscar</button>
            </form>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>{result}</li>
                ))}
            </ul>
        </div>
    );
}

export default Search;