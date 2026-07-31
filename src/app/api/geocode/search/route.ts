import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 3) {
    return NextResponse.json({ success: true, results: [] });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
      q
    )}&addressdetails=1&limit=5&accept-language=es`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'CensoIDPAeropuertoApp/1.0 (contacto@idpaeropuerto.org)',
      },
    });

    if (!res.ok) {
      throw new Error(`Error en búsqueda de direcciones: ${res.statusText}`);
    }

    const items = await res.json();

    const results = items.map((item: any) => {
      const addr = item.address || {};
      const distrito =
        addr.suburb ||
        addr.city_district ||
        addr.district ||
        addr.town ||
        addr.neighbourhood ||
        addr.municipality ||
        '';

      const provincia =
        addr.city ||
        addr.province ||
        addr.county ||
        addr.state_district ||
        distrito ||
        '';

      const departamento = addr.state || addr.region || provincia || '';

      const street = [addr.road, addr.house_number].filter(Boolean).join(' ');
      const addressName = street || item.display_name?.split(',')[0] || q;

      return {
        displayName: item.display_name,
        address: addressName,
        distrito: distrito || 'No especificado',
        provincia: provincia || 'No especificado',
        departamento: departamento || 'No especificado',
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      };
    });

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error: any) {
    console.error('Error en búsqueda de geocodificación:', error);
    return NextResponse.json(
      { success: false, error: 'Error al buscar direcciones' },
      { status: 500 }
    );
  }
}
