export async function getTravelTime(origin, destination, profile='driving') {
  try {
    const base = 'https://router.project-osrm.org/route/v1';
    const url = `${base}/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.routes && data.routes[0]) return data.routes[0].duration;
    return null;
  } catch (e) { console.error(e); return null; }
}
