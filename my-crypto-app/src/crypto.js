import React, { useState, useEffect } from 'react';

const CryptoTable = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState({ field: null, order: 'asc' });

  // Fetching Data Using `.then`
  const fetchDataUsingThen = () => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false")
      .then(response => response.json())
      .then(data => {
        setCryptoData(data);
        setFilteredData(data);
      })
      .catch(error => console.error("Error fetching data with .then:", error));
  };

  // Fetching Data Using `async/await`
  const fetchDataUsingAsync = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false");
      const data = await response.json();
      setCryptoData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching data with async/await:", error);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchDataUsingThen();
    // Uncomment the line below to use async/await fetch
    // fetchDataUsingAsync();
  }, []);

  // Search and filter the data
  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = cryptoData.filter(crypto =>
      crypto.name.toLowerCase().includes(query) || crypto.symbol.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  // Sorting functionality
  const handleSort = (field) => {
    const order = sortOrder.field === field && sortOrder.order === 'asc' ? 'desc' : 'asc';
    const sortedData = [...filteredData].sort((a, b) => {
      if (field === 'market_cap' || field === 'price_change_percentage_24h') {
        return order === 'asc' ? a[field] - b[field] : b[field] - a[field];
      }
      return 0;
    });
    setSortOrder({ field, order });
    setFilteredData(sortedData);
  };

  return (
    <div>
      <h1>Cryptocurrency Market Data</h1>

      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name or symbol"
      />
      <button onClick={handleSearch}>Search</button>

      {/* Sort Buttons */}
      <button onClick={() => handleSort('market_cap')}>
        Sort by Market Cap ({sortOrder.field === 'market_cap' && sortOrder.order})
      </button>
      <button onClick={() => handleSort('price_change_percentage_24h')}>
        Sort by 24h % Change ({sortOrder.field === 'price_change_percentage_24h' && sortOrder.order})
      </button>

      {/* Data Table */}
      <table border="1">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Current Price</th>
            <th>Market Cap</th>
            <th>Total Volume</th>
            <th>24h % Change</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((crypto) => (
            <tr key={crypto.id}>
              <td><img src={crypto.image} alt={crypto.name} width="20" /></td>
              <td>{crypto.name}</td>
              <td>{crypto.symbol.toUpperCase()}</td>
              <td>${crypto.current_price.toLocaleString()}</td>
              <td>${crypto.market_cap.toLocaleString()}</td>
              <td>${crypto.total_volume.toLocaleString()}</td>
              <td>{crypto.price_change_percentage_24h.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
