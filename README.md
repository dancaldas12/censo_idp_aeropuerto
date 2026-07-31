# 📍 Censo Geográfico - Iglesia IDP Aeropuerto

Aplicación web moderna, responsive, segura y ligera diseñada exclusivamente para recopilar la información geográfica de los miembros y creyentes de la **Iglesia IDP Aeropuerto** con el fin de planificar y aperturar futuras células pastorales.

Los datos recolectados se almacenan directamente en **Google Sheets** utilizando la API oficial de Google Cloud Platform (Google Sheets API v4) mediante una **Service Account**.

---

## 🚀 Características Principales

- **Landing Explicativa**: Presentación clara del propósito pastoral y del censo.
- **Formulario Inteligente**:
  - Captura de Datos Personales: Nombre completo, DNI, Edad, Teléfono, Correo electrónico y Tipo de persona (Miembro / Creyente).
  - Geolocalización Dual: Obtención rápida por GPS (Geolocalización del navegador) o Búsqueda manual de direcciones.
  - Mapa Interactivo (Leaflet): Pin arrastrable con vista previa en tiempo real.
  - Auto-completado de Distrito, Provincia y Departamento mediante geocodificación inversa.
- **Consentimiento Obligatorio**: Aceptación formal para el tratamiento de datos exclusivamente con fines pastorales.
- **Validaciones Rigurosas**:
  - DNI (exactamente 8 números).
  - Prevención de registros duplicados por DNI consultando Google Sheets.
  - Correo electrónico válido, edad real y campos requeridos.
- **Persistencia Directa en Google Sheets**: Generación automática de enlace a Google Maps por coordenadas (`https://www.google.com/maps?q=lat,lng`), UUID y fecha de registro.
- **Contenedorización Docker**: Multi-stage build listo para despliegue en cualquier servidor en menos de 1 minuto.

---

## 📊 Estructura de Filas en Google Sheets

La aplicación escribirá automáticamente en la hoja de cálculo respetando exactamente las siguientes **17 columnas**:

| Columna | Nombre de Campo | Ejemplo |
|---|---|---|
| A | `UUID` | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| B | `Fecha Registro` | `31/07/2026 15:30:00` |
| C | `Nombre Completo` | `Juan Carlos Pérez Gómez` |
| D | `DNI` | `12345678` |
| E | `Edad` | `35` |
| F | `Teléfono` | `987654321` |
| G | `Correo` | `juan.perez@ejemplo.com` |
| H | `Tipo Persona` | `Miembro` o `Creyente` |
| I | `Dirección` | `Av. Elmer Faucett 123` |
| J | `Referencia` | `Frente al Mercado Central` |
| K | `Distrito` | `Callao` |
| L | `Provincia` | `Callao` |
| M | `Departamento` | `Callao` |
| N | `Latitud` | `-12.046374` |
| O | `Longitud` | `-77.042793` |
| P | `Google Maps` | `https://www.google.com/maps?q=-12.046374,-77.042793` |
| Q | `Consentimiento` | `Sí` |

---

## 🛠️ Configuración de Google Cloud Service Account

Para integrar la persistencia con Google Sheets sin intermediarios ni automatizaciones de terceros, se requiere autenticar una Service Account de Google Cloud:

1. **Crear Proyecto en GCP**:
   - Ingresa a [Google Cloud Console](https://console.cloud.google.com/).
   - Crea un nuevo proyecto llamado `Censo IDP Aeropuerto`.

2. **Habilitar Google Sheets API**:
   - Ve a **APIs & Services > Library** (Biblioteca de APIs).
   - Busca `Google Sheets API` y haz clic en **Habilitar** (Enable).

3. **Crear Service Account**:
   - Ve a **APIs & Services > Credentials** (Credenciales).
   - Haz clic en **Create Credentials > Service Account** (Crear cuenta de servicio).
   - Asigna el nombre `censo-sa` y haz clic en **Crear y Continuar**.

4. **Descargar Llave Privada (JSON)**:
   - Haz clic en la Service Account recién creada y ve a la pestaña **Keys** (Llaves).
   - Selecciona **Add Key > Create new key** en formato **JSON**.
   - Se descargará un archivo `.json` a tu computadora.

5. **Compartir la Hoja de Google Sheets**:
   - Abre tu hoja de cálculo en Google Sheets.
   - Copia el correo electrónico de la Service Account (ej. `censo-sa@tu-proyecto.iam.gserviceaccount.com`).
   - Haz clic en el botón **Compartir** de tu hoja de Sheets y pega el correo de la Service Account otorgándole permisos de **Editor**.
   - Copia el **Sheet ID** de la URL de tu hoja:
     `https://docs.google.com/spreadsheets/d/`**`ESTE_ES_EL_GOOGLE_SHEET_ID`**`/edit`

---

## ⚙️ Variables de Entorno (`.env.local`)

Crea un archivo `.env.local` basado en `.env.example`:

```env
PORT=3000
NODE_ENV=production

# ID de la hoja de Google Sheets
GOOGLE_SHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz...

# Credenciales de Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL=censo-sa@tu-proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu_private_key_aqui\n-----END PRIVATE KEY-----\n"
```

---

## 🐳 Despliegue con Docker Compose (Producción)

Toda la aplicación está lista para ejecutarse con un único comando:

```bash
# 1. Construir e iniciar contenedores en segundo plano
docker compose up --build -d

# 2. Verificar estado del contenedor
docker compose ps

# 3. Ver logs en tiempo real
docker compose logs -f
```

La aplicación estará accesible en: `http://localhost:3000`

---

## 💻 Desarrollo Local (Sin Docker)

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

---

## 📂 Estructura del Proyecto

```text
censo_idp/
├── Dockerfile                   # Multi-stage Dockerfile en Alpine
├── docker-compose.yml           # Orquestación de producción/desarrollo
├── .env.example                 # Plantilla de variables de entorno
├── start.ps1 / start.sh         # Scripts interactivos de inicio
├── public/                      # Archivos estáticos e íconos
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── census/route.ts       # POST: Registro en Google Sheets & duplicados
    │   │   ├── check-dni/route.ts    # GET: Verificación previa de DNI
    │   │   └── geocode/
    │   │       ├── reverse/route.ts  # Reverse geocoding lat/lng -> Dirección/Distrito
    │   │       └── search/route.ts   # Autocompletado manual de direcciones
    │   ├── globals.css               # Tailwind CSS & Glassmorphism
    │   ├── layout.tsx                # Branding Header/Footer IDP Aeropuerto
    │   └── page.tsx                  # Landing + Censo Wizard Manager
    ├── components/
    │   ├── LandingHero.tsx           # Sección explicativa inicial
    │   ├── ConsentModal.tsx          # Modal de consentimiento pastoral
    │   ├── CensusForm.tsx            # Wizard stepper de 4 pasos
    │   ├── StepPersonalData.tsx      # Paso 1: Formulario datos personales
    │   ├── StepLocation.tsx          # Paso 2: Mapa Leaflet & GPS/Dirección
    │   ├── StepConfirmation.tsx      # Paso 3: Resumen & Aceptación
    │   ├── ThankYouCard.tsx          # Paso 4: Agradecimiento pastoral
    │   └── InteractiveMap.tsx        # Componente mapa Leaflet cliente
    └── lib/
        ├── googleSheets.ts           # Cliente autenticado Google Sheets API v4
        ├── validations.ts            # Esquemática Zod (DNI, Email, Edad)
        └── types.ts                  # Interfaces TypeScript
```

---

## ✝️ Créditos

Desarrollado para la **Iglesia IDP Aeropuerto** — Censo Geográfico 2026.
