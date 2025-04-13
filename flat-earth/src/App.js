import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function ChangeMapView({ coords }) {
  const map = useMap();
  map.setView(coords, 13);
  return null;
}

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [40, 40], // size of the icon
  iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40] // point from which the popup should open relative to the iconAnchor
});


function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [markerPosition, setMarkerPosition] = useState([26.51440955, 80.23178853130952]); // Paris

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
        <Marker position={markerPosition} icon={customIcon} />
        <ChangeMapView coords={markerPosition} />
      </MapContainer>
    </div>
  );
}

export default App;
