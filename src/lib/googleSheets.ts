import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Initializes and returns the authenticated Google Sheets API client.
 */
function getSheetsClient() {
  const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_KEY_FILE || 'credentials.json';
  const resolvedPath = path.isAbsolute(envPath)
    ? envPath
    : path.join(process.cwd(), envPath);

  if (fs.existsSync(resolvedPath)) {
    try {
      const fileContent = fs.readFileSync(resolvedPath, 'utf8');
      const parsed = JSON.parse(fileContent);
      // Ensure private_key has actual newlines, not escaped literal '\n'
      const privateKey = (parsed.private_key || '').replace(/\\n/g, '\n');

      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: parsed.client_email,
          private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      return google.sheets({ version: 'v4', auth });
    } catch (err: any) {
      console.warn('Error al leer credentials.json:', err.message);
    }
  }

  // Fallback to GOOGLE_SERVICE_ACCOUNT_JSON or individual env vars
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GCP_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    try {
      const parsed = typeof serviceAccountJson === 'string' ? JSON.parse(serviceAccountJson) : serviceAccountJson;
      const privateKey = (parsed.private_key || '').replace(/\\n/g, '\n');
      
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: parsed.client_email,
          private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      return google.sheets({ version: 'v4', auth });
    } catch (err: any) {
      console.warn('Error parsing GOOGLE_SERVICE_ACCOUNT_JSON:', err.message);
    }
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (clientEmail && privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return google.sheets({ version: 'v4', auth });
  }

  throw new Error(
    'Faltan las credenciales de Google Service Account en credentials.json o .env.local'
  );
}

/**
 * Retrieves the Google Sheet ID from environment variables.
 */
export function getSpreadsheetId(): string {
  const sheetId = process.env.GOOGLE_SHEET_ID || process.env.SPREADSHEET_ID;
  if (!sheetId || sheetId.includes('1AbCdEfGhIjKlMnOpQrStUvWxYz')) {
    throw new Error('Falta configurar GOOGLE_SHEET_ID con el ID real de tu hoja de Google Sheets en .env.local');
  }
  return sheetId;
}

/**
 * Checks if a given DNI already exists in the Google Sheet (Column 4 / DNI).
 */
export async function checkDniExists(dni: string): Promise<boolean> {
  try {
    const sheets = getSheetsClient();
    const spreadsheetId = getSpreadsheetId();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!D:D',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return false;

    const targetDni = dni.trim();
    return rows.some((row) => row[0] && String(row[0]).trim() === targetDni);
  } catch (error: any) {
    try {
      const sheets = getSheetsClient();
      const spreadsheetId = getSpreadsheetId();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'A:Z',
      });
      const rows = response.data.values;
      if (!rows || rows.length < 2) return false;

      const headers = rows[0].map((h: any) => String(h).toUpperCase().trim());
      const dniIdx = headers.findIndex((h: string) => h === 'DNI');
      if (dniIdx === -1) return false;

      const targetDni = dni.trim();
      return rows.slice(1).some((row) => row[dniIdx] && String(row[dniIdx]).trim() === targetDni);
    } catch (innerErr) {
      console.warn('Advertencia comprobando DNI en la hoja:', error.message);
      return false;
    }
  }
}

/**
 * Appends a new census record row into the Google Sheet.
 */
export async function appendCensusRow(data: {
  nombreCompleto: string;
  dni: string;
  edad: number | string;
  telefono: string;
  correo: string;
  tipoPersona: string;
  direccion: string;
  referencia?: string;
  distrito: string;
  provincia: string;
  departamento: string;
  latitud: number | string;
  longitud: number | string;
}): Promise<{ uuid: string; timestamp: string }> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const uuid = crypto.randomUUID();
  const timestamp = new Date().toLocaleString('es-PE', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const lat = String(data.latitud);
  const lng = String(data.longitud);
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  const rowValues = [
    uuid,
    timestamp,
    data.nombreCompleto.trim(),
    data.dni.trim(),
    String(data.edad),
    data.telefono.trim(),
    data.correo.trim().toLowerCase(),
    data.tipoPersona,
    data.direccion.trim(),
    (data.referencia || '').trim(),
    data.distrito.trim(),
    data.provincia.trim(),
    data.departamento.trim(),
    lat,
    lng,
    googleMapsUrl,
    'Sí',
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'A1',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [rowValues],
    },
  });

  return { uuid, timestamp };
}
