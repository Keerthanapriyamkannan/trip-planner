import React, { useRef, useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import MapView from './components/MapView';
import MarkerList from './components/MarkerList';
import ItineraryPlanner from './components/ItineraryPlanner';
import BudgetTracker from './components/BudgetTracker';
import PhotoUpload from './components/PhotoUpload';
import TripShare from './components/TripShare';
import ModeSwitcher from './components/ModeSwitcher';
import ItinerarySummary from './components/ItinerarySummary';
import useLocalStorage from './hooks/useLocalStorage';
import { getTravelTime } from './utils/getTravelTime';
import { showInAppNotification } from './utils/notify';

export default function App() {
  const mapRef = useRef(null);
  const [markers, setMarkers] = useLocalStorage('markers_full', []);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [route, setRoute] = useLocalStorage('route_full', []);
  const [mode, setMode] = useLocalStorage('mode_full', 'driving');

  useEffect(() => {
    const timers = [];
    markers.forEach(m => {
      if (!m.arrival) return;
      const arrival = new Date(m.arrival).getTime();
      const when = arrival - 10*60*1000;
      const now = Date.now();
      if (when > now) {
        const t = setTimeout(() => {
          showInAppNotification('Upcoming stop', `You'll arrive at ${m.title || m.resortName} in 10 minutes.`);
        }, when - now);
        timers.push(t);
      }
    });
    return () => timers.forEach(t => clearTimeout(t));
  }, [markers]);

  const centerMap = (pos) => {
    if (!mapRef.current) return;
    const lat = pos.lat ?? pos[0];
    const lng = pos.lng ?? pos[1];
    mapRef.current.flyTo([lat, lng], 10);
  };

  const handleSearch = async (latlng) => {
    setSearchedLocation([latlng[0], latlng[1]]);
    const newMarker = {
      id: Date.now(),
      position: { lat: latlng[0], lng: latlng[1] },
      title: latlng[2] || 'Place',
      resortName: '',
      type: 'place',
      stayMinutes: 60,
      arrival: null,
      departure: null,
      expenses: [],
      media: [],
      favorite: false,
      rating: 0
    };

    if (markers.length === 0) {
      const now = new Date();
      newMarker.arrival = now.toISOString();
      newMarker.departure = new Date(now.getTime() + newMarker.stayMinutes*60000).toISOString();
    } else {
      const last = markers[markers.length-1];
      const lastDeparture = last.departure ? new Date(last.departure) : new Date();
      const seconds = await getTravelTime(last.position, newMarker.position, mode) || 0;
      const arrival = new Date(lastDeparture.getTime() + seconds*1000);
      newMarker.arrival = arrival.toISOString();
      newMarker.departure = new Date(arrival.getTime() + newMarker.stayMinutes*60000).toISOString();
    }

    setMarkers(prev => [...prev, newMarker]);
  };

  const addToRoute = (m) => setRoute(prev => [...prev, { lat: m.position.lat, lng: m.position.lng }]);
  const clearRoute = () => setRoute([]);
  const updateMarker = (id, patch) => setMarkers(prev => prev.map(m => m.id===id ? { ...m, ...patch } : m));
  const deleteMarker = (id) => setMarkers(prev => prev.filter(m => m.id !== id));
  const toggleFavorite = (id) => setMarkers(prev => prev.map(m => m.id===id ? { ...m, favorite: !m.favorite } : m));
  const setRating = (id, v) => updateMarker(id, { rating: v });

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      <div className='header'><div>Trip Planner — Full</div></div>
      <SearchBar onSearch={handleSearch} />
      <div className='container'>
        <div className='sidebar'>
          <h3>Saved Markers</h3>
          <MarkerList markers={markers} onDelete={deleteMarker} onCenter={centerMap} onAddToRoute={(m)=>addToRoute(m)} toggleFavorite={toggleFavorite} setRating={setRating} />
          <hr style={{ margin:'12px 0' }} />
          <h3>Route</h3>
          <ModeSwitcher mode={mode} setMode={setMode} />
          <div className='small'>Stops in route order</div>
          <ol>{route.map((r,idx)=><li key={idx}>{r.lat.toFixed(4)}, {r.lng.toFixed(4)}</li>)}</ol>
          <div style={{ display:'flex', gap:8, marginTop:8 }}>
            <button className='btn' onClick={()=> { if (route.length<2) return alert('Need 2 points'); }}>Show Route</button>
            <button className='btn-ghost' onClick={()=> clearRoute()}>Clear</button>
          </div>

          <hr style={{ margin:'12px 0' }} />
          <ItineraryPlanner markers={markers} updateMarker={updateMarker} />
          <hr style={{ margin:'12px 0' }} />
          <BudgetTracker markers={markers} updateMarker={updateMarker} />
          <hr style={{ margin:'12px 0' }} />
          <PhotoUpload markers={markers} updateMarker={updateMarker} />
          <hr style={{ margin:'12px 0' }} />
          <TripShare markers={markers} />
        </div>

        <div className='map-area'>
          <MapView markers={markers} setMarkers={setMarkers} searchedLocation={searchedLocation} mapRef={mapRef} routeWaypoints={route} mode={mode} />
        </div>
      </div>
    </div>
  );
}
