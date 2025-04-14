import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { db, storage } from './firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [markerPosition, setMarkerPosition] = useState([48.8566, 2.3522]);
  const [formData, setFormData] = useState({ title: '', review: '', image: null });

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
        { headers: { 'User-Agent': 'flat-earth-app/1.0' } }
      );
      const data = await response.json();
      if (data.length > 0) {
        const lat = Number(data[0].lat);
        const lon = Number(data[0].lon);
        setMarkerPosition([lat, lon]);
      } else {
        alert('Location not found');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in to submit a review.');

    try {
      let imageUrl = '';
      if (formData.image) {
        const imageRef = ref(storage, `images/${Date.now()}-${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'locations'), {
        title: formData.title,
        review: formData.review,
        coords: markerPosition,
        imageUrl,
        userId: user.uid,
        timestamp: serverTimestamp()
      });

      alert('Review submitted!');
      setFormData({ title: '', review: '', image: null });
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to submit review.');
    }
  };

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      alert('Login failed.');
    }
  };

  const handleSignup = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch {
      alert('Signup failed.');
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header align='center' style={{ backgroundColor: '#333', color: '#fff', padding: '10px', fontSize: '20px' }}>
        Flat Earth 🌍
        {user && (
          <button onClick={handleLogout} style={{ float: 'right', marginRight: '20px' }}>
            Logout
          </button>
        )}
      </header>

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

      <div style={{ flex: 1, display: 'flex' }}>
        <MapContainer center={markerPosition} zoom={13} style={{ width: '70%', height: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={markerPosition} icon={customIcon} />
          <ChangeMapView coords={markerPosition} />
        </MapContainer>

        <div style={{
          width: '30%',
          padding: '20px',
          background: '#f9f9f9',
          borderLeft: '1px solid #ccc',
          boxShadow: '-2px 0 5px rgba(0,0,0,0.1)'
        }}>
          {!user ? (
            <>
              <h3>Login / Signup</h3>
              <AuthForm onLogin={handleLogin} onSignup={handleSignup} />
            </>
          ) : (
            <>
              <h3>Add Location Info</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Title:</label><br />
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required style={{ width: '100%' }} />
                </div>
                <div>
                  <label>Review:</label><br />
                  <textarea name="review" value={formData.review} onChange={handleInputChange} rows="3" required style={{ width: '100%' }} />
                </div>
                <div>
                  <label>Image:</label><br />
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
                <button type="submit" style={{ marginTop: '10px' }}>Submit</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AuthForm({ onLogin, onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
      <div>
        <button onClick={() => onLogin(email, password)} style={{ marginRight: '10px' }}>Login</button>
        <button onClick={() => onSignup(email, password)}>Signup</button>
      </div>
    </>
  );
}

export default App;
