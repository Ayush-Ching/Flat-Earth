import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [position, setPosition] = useState([51.505, -0.09]); // Default center
  const [searchedLocation, setSearchedLocation] = useState(null);

  const mapRef = useRef();

  const handleSearch = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const coords = [parseFloat(lat), parseFloat(lon)];
      setSearchedLocation({ coords, display_name });
      setPosition(coords);
      if (mapRef.current) {
        mapRef.current.setView(coords, 13);
      }
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ padding: '10px', background: '#f0f0f0' }}>
        <input
          type="text"
          placeholder="Search for a place"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '8px 12px', marginLeft: '10px' }}>Search</button>
      </form>

      {/* Map */}
      <div style={{ flexGrow: 1 }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {searchedLocation && <Marker position={searchedLocation.coords} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
