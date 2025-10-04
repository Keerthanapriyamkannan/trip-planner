import React, { useState } from 'react';
export default function PhotoUpload({ markers = [], updateMarker }) {
  const [selectedId, setSelectedId] = useState(markers[0]?.id ?? '');
  const onFile = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedId) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const m = markers.find(x => x.id === Number(selectedId));
      const media = m.media ? [...m.media] : [];
      media.push({ id: Date.now(), name: file.name, dataUrl });
      updateMarker(m.id, { media });
    };
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <h3>Photos & Media</h3>
      <select className='input' value={selectedId} onChange={e=>setSelectedId(Number(e.target.value))}>
        <option value=''>Select stop</option>
        {markers.map(m=> <option key={m.id} value={m.id}>{m.title}</option>)}
      </select>
      <input type='file' accept='image/*' onChange={onFile} />
    </div>
  );
}
