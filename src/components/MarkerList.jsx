import React from 'react';
export default function MarkerList({ markers = [], onDelete = ()=>{}, onCenter = ()=>{}, onAddToRoute = ()=>{}, toggleFavorite = ()=>{}, setRating = ()=>{} }) {
  return (
    <div>
      <h3>Saved Places</h3>
      {markers.length === 0 && <div className='small'>No markers yet — use search or click the map.</div>}
      <ul style={{ listStyle:'none', padding:0 }}>
        {markers.map(m => (
          <li key={m.id} className='marker-card'>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700 }}>{m.favorite ? '⭐ ' : (m.type==='resort' ? '🏨 ' : '📍 ')}{m.title || m.resortName || 'Untitled'}</div>
                <div className='small'>{m.arrival ? new Date(m.arrival).toLocaleString() : `${m.position.lat.toFixed(4)}, ${m.position.lng.toFixed(4)}`}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <button className='btn-ghost' onClick={() => onCenter(m.position)}>Center</button>
                <button className='btn' onClick={() => onDelete(m.id)}>Delete</button>
              </div>
            </div>
            <div style={{ marginTop:8, display:'flex', gap:8, alignItems:'center' }}>
              <button className='btn-ghost' onClick={() => onAddToRoute(m)}>Add to Route</button>
              <button className='btn-ghost' onClick={() => toggleFavorite(m.id)}>{m.favorite ? 'Unfav' : 'Fav'}</button>
              <div>
                <label className='small' style={{ display:'block' }}>Rating</label>
                <select value={m.rating || 0} onChange={(e)=> setRating(m.id, Number(e.target.value))}>
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop:8 }}>
              {(m.media||[]).slice(0,3).map(md => <img key={md.id} src={md.dataUrl} className='photo-thumb' alt={md.name} />)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
