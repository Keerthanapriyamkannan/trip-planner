import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet-routing-machine';
import fixLeafletIcons from '../utils/leafletIconFix';
fixLeafletIcons();
function FlyTo({ pos }) { const map = useMap(); if(pos) map.flyTo([pos[0],pos[1]],12); return null; }
export default function MapView({ markers=[], setMarkers, searchedLocation, mapRef, routeWaypoints=[], mode='driving' }) {
  useEffect(()=>{ if(!mapRef?.current) return; let control=null; if(markers.length>1){ const L = require('leaflet'); const waypoints = markers.map(m=> L.latLng(m.position.lat, m.position.lng)); control = L.Routing.control({ waypoints, lineOptions:{styles:[{color:'#2563eb',weight:4}]}, routeWhileDragging:false, addWaypoints:false, createMarker:()=>null, router: L.Routing.osrmv1({serviceUrl:'https://router.project-osrm.org/route/v1'}) }).addTo(mapRef.current); } return ()=>{ if(control && mapRef.current){ try{ mapRef.current.removeControl(control);}catch{} } } }, [markers, mapRef, mode]);
  const handleMapClick = (e) => { const latlng = e.latlng || e; const newMarker = { id: Date.now(), position:{lat:latlng.lat,lng:latlng.lng}, title:'', description:'', type:'place', resortName:'', stayMinutes:60, arrival:null, departure:null, expenses:[], media:[], favorite:false, rating:0 }; setMarkers(prev=>[...prev,newMarker]); };
  return (
    <MapContainer center={[12.9716,77.5946]} zoom={6} style={{height:'100%',width:'100%'}} whenCreated={map=>{ if(mapRef) mapRef.current = map; mapRef.current.on('click', handleMapClick); }}>
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      {searchedLocation && <FlyTo pos={searchedLocation} />}
      {markers.map(m=> <Marker key={m.id} position={[m.position.lat, m.position.lng]}><Popup><div style={{minWidth:220}}><strong>{m.title||'Untitled'}</strong><div className='small'>⏰ {m.arrival? new Date(m.arrival).toLocaleString() : '—'}</div><div style={{marginTop:8}}><small>{m.description}</small></div></div></Popup></Marker>)}
      {routeWaypoints && routeWaypoints.length>1 && <Polyline positions={routeWaypoints.map(r=>[r.lat,r.lng])} color='#2563eb' weight={3} dashArray={'8 6'} />}
    </MapContainer>
  );
}
