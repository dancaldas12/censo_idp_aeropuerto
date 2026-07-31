import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Manual dotenv loading for standalone script execution
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

async function testCredentials() {
  console.log('\n======================================================');
  console.log('🔍 TEST DE DIAGNÓSTICO: CREDENCIALES DE GOOGLE SHEETS');
  console.log('======================================================\n');

  loadEnv();

  // 1. Check Credentials File
  const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 'credentials.json';
  const resolvedPath = path.isAbsolute(keyFilePath)
    ? keyFilePath
    : path.join(process.cwd(), keyFilePath);

  if (!fs.existsSync(resolvedPath)) {
    console.error('❌ ERROR: No se encontró el archivo de credenciales en:', resolvedPath);
    console.error('👉 Asegúrate de guardar el archivo .json descargado de GCP como "credentials.json" en la raíz del proyecto.\n');
    process.exit(1);
  }

  console.log('✅ 1. Archivo de credenciales encontrado:', keyFilePath);

  let credentialsJson: any;
  try {
    const fileContent = fs.readFileSync(resolvedPath, 'utf8');
    credentialsJson = JSON.parse(fileContent);
    console.log('✅ 2. Estructura JSON válida. Service Account Email:');
    console.log('   📧', credentialsJson.client_email);
  } catch (err: any) {
    console.error('❌ ERROR al parsear el archivo JSON:', err.message);
    process.exit(1);
  }

  // 2. Check Private Key formatting
  let privateKey = credentialsJson.private_key || '';
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    console.error('❌ ERROR: El campo "private_key" dentro del JSON no parece ser una clave RSA válida.');
    process.exit(1);
  }
  privateKey = privateKey.replace(/\\n/g, '\n');
  console.log('✅ 3. Clave RSA detectada correctamente.');

  // 3. Test JWT Authentication with GCP OAuth
  console.log('\n🔐 Autenticando con Google OAuth2 Server...');
  let authClient: any;
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentialsJson.client_email,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    authClient = await auth.getClient();
    const tokenResponse = await authClient.getAccessToken();
    if (tokenResponse && tokenResponse.token) {
      console.log('✅ 4. Autenticación exitosa. Token de acceso GCP generado.');
    } else {
      console.warn('⚠️ Se generó el cliente de autenticación, pero el token está vacío.');
    }
  } catch (authErr: any) {
    console.error('\n❌ ERROR DE AUTENTICACIÓN GCP:');
    console.error('   ', authErr.message);
    if (authErr.message.includes('invalid_grant')) {
      console.error('\n💡 CAUSA PROBABLE: La clave privada "private_key" dentro de credentials.json está incompleta o alterada.');
      console.error('👉 RECOMENDACIÓN: Descarga una NUEVA llave JSON desde GCP Console (Service Accounts -> Keys -> Add Key -> JSON) y reemplaza el archivo credentials.json.');
    }
    process.exit(1);
  }

  // 4. Test Google Sheet Access
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  console.log('\n📄 Verificando acceso a la Hoja de Google Sheets...');
  if (!spreadsheetId || spreadsheetId.includes('1AbCdEfGhIjKlMnOpQrStUvWxYz')) {
    console.error('❌ ERROR: GOOGLE_SHEET_ID no está configurado en .env.local');
    process.exit(1);
  }
  console.log('   🆔 Sheet ID:', spreadsheetId);

  try {
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const title = response.data.properties?.title || 'Sin Título';
    console.log(`✅ 5. Acceso exitoso a la hoja: "${title}"`);
    console.log('\n🎉 ¡TODAS LAS COMPROBACIONES PASARON CORRECTAMENTE!');
    console.log('   Tu aplicación está 100% lista para registrar datos en Google Sheets.\n');
  } catch (sheetErr: any) {
    console.error('\n❌ ERROR AL ACCEDER A LA HOJA DE GOOGLE SHEETS:');
    console.error('   ', sheetErr.message);

    if (sheetErr.code === 403 || sheetErr.message.includes('Permission')) {
      console.error('\n💡 CAUSA: La cuenta de servicio no tiene permisos en esta hoja.');
      console.error(`👉 RECOMENDACIÓN: Abre la hoja en tu navegador, haz clic en "Compartir" y agrega el correo:`);
      console.error(`   ${credentialsJson.client_email}`);
      console.error('   con el rol de "Editor".');
    } else if (sheetErr.code === 404) {
      console.error('\n💡 CAUSA: No se encontró la hoja con el ID proporcionado.');
      console.error('👉 RECOMENDACIÓN: Revisa que el GOOGLE_SHEET_ID en tu .env.local sea el correcto.');
    }
  }
}

testCredentials();
