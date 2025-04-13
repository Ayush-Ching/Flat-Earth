import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}

export default App;
