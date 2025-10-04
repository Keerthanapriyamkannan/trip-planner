import React from 'react';
export default function ModeSwitcher({ mode, setMode }) {
  return (<div style={{display:'flex',gap:8}}><button className={mode==='driving'?'btn':'btn-ghost'} onClick={()=>setMode('driving')}>🚗 Driving</button><button className={mode==='walking'?'btn':'btn-ghost'} onClick={()=>setMode('walking')}>🚶 Walking</button><button className={mode==='cycling'?'btn':'btn-ghost'} onClick={()=>setMode('cycling')}>🚴 Cycling</button></div>);
}
