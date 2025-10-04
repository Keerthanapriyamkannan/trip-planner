import React from 'react';
export default function ItinerarySummary({ markers = [] }) {
  if (!markers || markers.length === 0) return null;
  const sorted = [...markers].sort((a,b) => (a.arrival?new Date(a.arrival):0) - (b.arrival?new Date(b.arrival):0));
  return (<div style={{marginTop:12}}><h3>Itinerary</h3>{sorted.map(m=> <div key={m.id}><strong>{m.title}</strong><div className='small'>{m.arrival?new Date(m.arrival).toLocaleString():'—'}</div></div>)}</div>);
}
