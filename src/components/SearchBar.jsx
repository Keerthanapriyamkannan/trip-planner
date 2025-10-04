import React, { useState } from 'react';
export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');
  const submit = async (e) => {
    e?.preventDefault();
    if (!q.trim()) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
    try {
      const res = await fetch(url);
      const arr = await res.json();
      if (arr && arr.length > 0) {
        const first = arr[0];
        onSearch([parseFloat(first.lat), parseFloat(first.lon), first.display_name]);
        setQ('');
      } else alert('No results');
    } catch (err) { console.error(err); alert('Search failed'); }
  };
  return (
    <form onSubmit={submit} style={{ display:'flex', gap:8, padding:10, background:'#fff', borderBottom:'1px solid #eef2f6' }}>
      <input className='input' placeholder='Search place or address' value={q} onChange={(e)=>setQ(e.target.value)} />
      <button className='btn' type='submit'>Search</button>
    </form>
  );
}
