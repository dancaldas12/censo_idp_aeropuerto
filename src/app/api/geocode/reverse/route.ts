import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lng') || searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { success: false, error: 'Coordenadas latitud y longitud requeridas' },
      { status: 400 }
    );
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}&addressdetails=1&accept-language=es`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'CensoIDPAeropuertoApp/1.0 (contacto@idpaeropuerto.org)',
      },
    });

    if (!res.ok) {
      throw new Error(`Error de geocodificación: ${res.statusText}`);
    }

    const data = await res.json();
    const addr = data.address || {};

    // Extract district, province, department for Peru / Latin America administrative divisions
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

    const departamento =
      addr.state ||
      addr.region ||
      provincia ||
      '';

    const street = [addr.road, addr.house_number || addr.building].filter(Boolean).join(' ');
    const fullAddress = street
      ? street
      : data.display_name?.split(',')[0] || 'Ubicación seleccionada';

    return NextResponse.json({
      success: true,
      data: {
        address: fullAddress,
        distrito: distrito || 'No especificado',
        provincia: provincia || 'No especificado',
        departamento: departamento || 'No especificado',
        latitud: parseFloat(lat),
        longitud: parseFloat(lon),
        displayName: data.display_name || '',
      },
    });
  } catch (error: any) {
    console.error('Error en geocodificación inversa:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'No se pudo obtener la dirección automática para estas coordenadas',
      },
      { status: 500 }
    );
  }
}
