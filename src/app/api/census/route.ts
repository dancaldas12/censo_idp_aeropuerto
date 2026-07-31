import { NextRequest, NextResponse } from 'next/server';
import { censusFormSchema } from '@/lib/validations';
import { appendCensusRow, checkDniExists } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate payload using Zod schema
    const validationResult = censusFormSchema.safeParse(body);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: 'Datos del formulario inválidos',
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 2. Check for duplicate DNI in Google Sheets
    try {
      const isDuplicate = await checkDniExists(data.dni);
      if (isDuplicate) {
        return NextResponse.json(
          {
            success: false,
            error: `El DNI ${data.dni} ya se encuentra registrado en el censo.`,
          },
          { status: 409 }
        );
      }
    } catch (checkErr: any) {
      console.warn('Advertencia en verificación de DNI:', checkErr.message);
      // Proceed if check fails due to empty sheet / first row
    }

    // 3. Append row to Google Sheets
    const result = await appendCensusRow(data);

    return NextResponse.json(
      {
        success: true,
        message: 'Registro completado exitosamente',
        data: {
          uuid: result.uuid,
          fechaRegistro: result.timestamp,
          nombreCompleto: data.nombreCompleto,
          dni: data.dni,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error procesando registro de censo:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error interno al guardar los datos en Google Sheets',
      },
      { status: 500 }
    );
  }
}
