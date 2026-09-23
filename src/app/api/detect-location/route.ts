import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { lat, lon } = body;

    // 1. If GPS coordinates provided, reverse geocode with Nominatim (using server User-Agent)
    if (typeof lat === 'number' && typeof lon === 'number') {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          {
            headers: {
              'User-Agent': 'RuralixApp/1.0 (contact@ruralix.app)',
              'Accept': 'application/json'
            }
          }
        );
        if (res.ok) {
          const data = await res.json();
          const address = data.address || {};
          const place = address.village || address.town || address.city || address.county || address.suburb || address.state_district || '';
          const state = address.state || '';
          const country = address.country || 'India';
          const finalLocation = [place, state, country].filter(Boolean).join(', ');
          if (finalLocation) {
            return NextResponse.json({ location: finalLocation, source: 'gps' });
          }
        }
      } catch (e) {
        console.warn('Reverse geocoding error:', e);
      }
    }

    // 2. Fallback to IP Geolocation via ip-api.com
    try {
      const ipRes = await fetch('http://ip-api.com/json/?fields=status,country,regionName,city,lat,lon', {
        headers: { 'Accept': 'application/json' }
      });
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.status === 'success' && ipData.city) {
          const locStr = [ipData.city, ipData.regionName, ipData.country].filter(Boolean).join(', ');
          return NextResponse.json({ location: locStr, source: 'ip' });
        }
      }
    } catch (e) {
      console.warn('IP geolocation error:', e);
    }

    // 3. Fallback default
    return NextResponse.json({ location: 'Delhi, India', source: 'default' });
  } catch (err) {
    return NextResponse.json({ location: 'Delhi, India', source: 'fallback' });
  }
}

export async function GET() {
  return POST(new Request('http://localhost/api/detect-location', { method: 'POST' }));
}
