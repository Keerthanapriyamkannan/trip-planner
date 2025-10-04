export async function getPlaceNameFromCoords(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.display_name || 'Unknown Place';
  } catch (e) { console.error(e); return 'Unknown Place'; }
}
