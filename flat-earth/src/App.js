import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ChangeMapView({ coords }) {
  const map = useMap();
  map.setView(coords, 13);
  return null;
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [markerPosition, setMarkerPosition] = useState([48.8566, 2.3522]); // Paris

  const handleSearch = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
    );
    const data = await response.json();

    console.log("Search results:", data);

    if (data && data.length > 0) {
      const lat = Number(data[0].lat);
      const lon = Number(data[0].lon);
      const coords = [lat, lon];

      setMarkerPosition(coords);
    } else {
      alert('Location not found.');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <form onSubmit={handleSearch} style={{ padding: '10px', background: '#eee' }}>
        <input
          type="text"
          value={searchQuery}
          placeholder="Search location"
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
        <button type="submit" style={{ marginLeft: '10px' }}>Search</button>
      </form>

      <MapContainer
        center={markerPosition}
        zoom={13}
        style={{ flex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <Marker position={markerPosition} />
        <ChangeMapView coords={markerPosition} />
      </MapContainer>
    </div>
  );
}

export default App;
