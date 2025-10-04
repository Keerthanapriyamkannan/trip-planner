import React from 'react';
export default function TripShare({ markers = [] }) {
  const copyLink = () => { navigator.clipboard?.writeText(window.location.href); alert('Link copied to clipboard'); };
  const exportJSON = () => {
    const data = { markers, created: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'trip.json'; a.click(); URL.revokeObjectURL(url);
  };
  const importJSON = (e) => {
    const f = e.target.files[0]; if(!f) return; const r = new FileReader(); r.onload = () => { try { const data = JSON.parse(r.result); if (data.markers) { alert('Imported trip JSON. Replace existing markers manually as needed.'); } else alert('Invalid format'); } catch(err){ alert('Invalid JSON'); } }; r.readAsText(f);
  };
  return (<div><h3>Share & Export</h3><div style={{display:'flex',gap:8}}><button className='btn' onClick={copyLink}>Copy Share Link</button><button className='btn-ghost' onClick={exportJSON}>Export JSON</button><input type='file' accept='application/json' onChange={importJSON} /></div></div>);
}
