import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function ChangeMapView({ coords }) {
  const map = useMapEvents({});
  map.setView(coords, 13);
  return null;
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [markerPosition, setMarkerPosition] = useState([48.8566, 2.3522]); // Default: Paris

  const [formData, setFormData] = useState({
    title: '',
    review: '',
    image: null,
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'User-Agent': 'flat-earth-app/1.0',
          },
        }
      );
      const data = await response.json();
      console.log('Search results:', data);
  
      if (data && data.length > 0) {
        const lat = Number(data[0].lat);
        const lon = Number(data[0].lon);
        setMarkerPosition([lat, lon]);
      } else {
        alert('Location not found.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed');
    }
  };
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!markerPosition || markerPosition.length !== 2) {
      alert("Please search for a place before submitting a review.");
      return;
    }
  
    const submission = {
      title: formData.title,
      review: formData.review,
      image: formData.image,
      coords: markerPosition,
    };
  
    console.log('📍 Submitting Review for Marker:', submission);
  
    alert('Submitted! Check the console.');
    setFormData({ title: '', review: '', image: null });
  };
  
  

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* App Title */}
      <header align = 'center' style={{ backgroundColor: '#333', color: '#fff', padding: '10px', fontSize: '20px' }}>
        Flat Earth 🌍
      </header>

      {/* Search Bar */}
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


      {/* Main Content: Map + Review Form */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Map Area */}
        <MapContainer
          center={markerPosition}
          zoom={13}
          style={{ width: '70%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          <Marker position={markerPosition} icon={customIcon} />
          <ChangeMapView coords={markerPosition} />
        </MapContainer>

        {/* Review Form Panel */}
        <div style={{
          width: '30%',
          padding: '20px',
          background: '#f9f9f9',
          borderLeft: '1px solid #ccc',
          boxShadow: '-2px 0 5px rgba(0,0,0,0.1)'
        }}>
          <h3>Add Location Info</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title:</label><br />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label>Review:</label><br />
              <textarea
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                rows="3"
                required
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label>Image:</label><br />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <button type="submit" style={{ marginTop: '10px' }}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
