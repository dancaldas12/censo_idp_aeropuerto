import { NextRequest, NextResponse } from 'next/server';
import { checkDniExists } from '@/lib/googleSheets';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dni = searchParams.get('dni');

  if (!dni || !/^\d{8}$/.test(dni)) {
    return NextResponse.json(
      { success: false, error: 'DNI debe contener 8 dígitos' },
      { status: 400 }
    );
  }

  try {
    const exists = await checkDniExists(dni);
    return NextResponse.json({
      success: true,
      exists,
      dni,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, exists: false, error: error.message },
      { status: 500 }
    );
  }
}
