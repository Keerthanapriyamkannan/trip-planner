import React from 'react';
export default function ItineraryPlanner({ markers = [], updateMarker }) {
  const sorted = [...markers].filter(m => m.arrival).sort((a,b) => new Date(a.arrival) - new Date(b.arrival));
  const edit = (m) => {
    const cur = m.arrival ? new Date(m.arrival).toISOString().slice(0,16) : '';
    const input = prompt('Arrival (YYYY-MM-DDTHH:MM)', cur);
    if(!input) return;
    const arrival = new Date(input).toISOString();
    const stay = parseInt(prompt('Stay minutes', String(m.stayMinutes || 60)) || 60, 10);
    const departure = new Date(new Date(arrival).getTime() + stay*60000).toISOString();
    updateMarker(m.id, { arrival, departure, stayMinutes: stay });
  };
  return (
    <div>
      <h3>Itinerary</h3>
      {sorted.length === 0 && <div className='small'>No scheduled stops.</div>}
      <ol>
        {sorted.map(m => (
          <li key={m.id} style={{ marginBottom:8 }}>
            <div style={{ fontWeight:700 }}>{m.title}</div>
            <div className='small'>{m.arrival ? new Date(m.arrival).toLocaleString() : '—'} → {m.departure ? new Date(m.departure).toLocaleString() : '—'}</div>
            <div style={{ marginTop:6 }}>
              <button className='btn-ghost' onClick={()=> edit(m)}>Edit Time</button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
