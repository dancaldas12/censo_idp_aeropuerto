# 📍 Censo Geográfico - Iglesia de Dios de la Profecía Aeropuerto

Aplicación web moderna, responsive, segura y de alto rendimiento diseñada exclusivamente para recopilar la información geográfica de los miembros y creyentes de la **Iglesia de Dios de la Profecía Aeropuerto** (IDP Aeropuerto) con el fin de planificar y aperturar futuras células pastorales.

Los datos recolectados se almacenan directamente en **Google Sheets** utilizando la API oficial de Google Cloud Platform (Google Sheets API v4) mediante una **Service Account**.

---

## 🚀 Características Principales

- **Diseño Responsive & Glassmorphism**: Adaptado a cualquier dispositivo móvil, tablet y escritorio con soporte para zoom táctil iOS.
- **Identidad Oficial**: Logo e identidad corporativa de la *Iglesia de Dios de la Profecía Aeropuerto*.
- **Formulario Inteligente por Pasos**:
  - **Paso 1: Datos Personales**: Nombre completo, DNI (8 dígitos con validación y prevención de duplicados), Edad, Teléfono, Correo electrónico y Tipo de persona (Miembro / Creyente).
  - **Paso 2: Geolocalización Dual**: Detección automática por GPS del dispositivo o Búsqueda interactiva de direcciones con mapa Leaflet y pin arrastrable. Auto-completado de Distrito, Provincia y Departamento.
  - **Paso 3: Confirmación & Consentimiento**: Resumen detallado y aceptación formal para el tratamiento de datos con fines pastorales.
  - **Paso 4: Agradecimiento**: Confirmación visual con código de registro único (UUID) y cita bíblica.
- **Persistencia Directa en Google Sheets**: Generación automática de enlace a Google Maps por coordenadas (`https://www.google.com/maps?q=lat,lng`), UUID y fecha/hora de registro (zona horaria de Lima, Perú).
- **Listo para Despliegue en Vercel y Docker**.

---

## 📊 Estructura de Filas en Google Sheets

La aplicación escribe automáticamente en la hoja de cálculo respetando exactamente las siguientes **17 columnas**:

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

## ☁️ Despliegue en Vercel (Paso a Paso)

Para desplegar la aplicación en **Vercel**:

### 1. Importar el Repositorio
1. Entra a [Vercel Dashboard](https://vercel.com/dashboard) e inicia sesión con tu cuenta de GitHub (`dancaldas12`).
2. Haz clic en **"Add New..." > "Project"**.
3. Selecciona el repositorio `censo_idp_aeropuerto` y haz clic en **"Import"**.
4. Framework Preset: **Next.js** (se detecta automáticamente).

### 2. Configurar Variables de Entorno en Vercel
En la sección **"Environment Variables"** antes de presionar *Deploy* (o en *Settings > Environment Variables* si el proyecto ya fue creado), agrega las siguientes variables:

#### Opción A: Variables Individuales (Recomendada)
| Variable | Valor / Descripción |
|---|---|
| `GOOGLE_SHEET_ID` | El ID de tu hoja de Google Sheets (ej: `1AbCdEfGhIjKlMnOpQrStUvWxYz...`) |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | El email de la Service Account de tu `credentials.json` (ej: `censo-sa@tu-proyecto.iam.gserviceaccount.com`) |
| `GOOGLE_PRIVATE_KEY` | La clave privada completa de tu `credentials.json` incluyendo `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----` |

> 💡 **Tip para `GOOGLE_PRIVATE_KEY`**: Puedes pegar el texto completo con saltos de línea directamente en el campo de valor de Vercel.

#### Opción B: JSON Completo
Si prefieres configurar una sola variable con todas las credenciales de GCP:
| Variable | Valor / Descripción |
|---|---|
| `GOOGLE_SHEET_ID` | El ID de tu hoja de Google Sheets |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Todo el contenido de tu archivo `credentials.json` en una sola línea de texto |

### 3. Desplegar
- Haz clic en **"Deploy"**. Vercel compilará la aplicación y te generará tu URL pública (ej: `https://censo-idp-aeropuerto.vercel.app`).

---

## 🛠️ Configuración de Google Cloud Service Account

Para permitir que la aplicación escriba en tu hoja de Google Sheets:

1. **Crear Proyecto en GCP**:
   - Ingresa a [Google Cloud Console](https://console.cloud.google.com/).
   - Crea un nuevo proyecto llamado `Censo IDP Aeropuerto`.

2. **Habilitar Google Sheets API**:
   - Ve a **APIs & Services > Library**.
   - Busca `Google Sheets API` y haz clic en **Habilitar** (Enable).

3. **Crear Service Account**:
   - Ve a **APIs & Services > Credentials**.
   - Haz clic en **Create Credentials > Service Account**.
   - Asigna el nombre `censo-sa` y haz clic en **Crear y Continuar**.

4. **Descargar Llave Privada (JSON)**:
   - Haz clic en la Service Account creada y ve a la pestaña **Keys** (Claves).
   - Selecciona **Add Key > Create new key** en formato **JSON**.
   - Se descargará tu archivo `credentials.json`.

5. **Compartir la Hoja de Google Sheets**:
   - Abre tu hoja de cálculo en Google Sheets.
   - Copia el correo de la Service Account (ej. `censo-sa@tu-proyecto.iam.gserviceaccount.com`).
   - Haz clic en el botón **Compartir** de la hoja y pega el correo otorgándole rol de **Editor**.
   - Copia el **Sheet ID** de la URL:
     `https://docs.google.com/spreadsheets/d/`**`ESTE_ES_EL_GOOGLE_SHEET_ID`**`/edit`

---

## 💻 Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
# Copia .env.example a .env.local y completa tus credenciales o coloca credentials.json en la raíz
cp .env.example .env.local

# 3. Iniciar servidor de desarrollo
npm run dev
```

Abre en tu navegador: `http://localhost:3000`

---

## 🐳 Despliegue Local con Docker Compose

```bash
# Construir e iniciar contenedores
docker compose up --build -d

# Ver logs
docker compose logs -f
```

---

## 📂 Estructura del Proyecto

```text
censo_idp/
├── public/
│   └── logo.jpg                      # Logo oficial Iglesia de Dios de la Profecía Aeropuerto
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── census/route.ts       # POST: Registro en Google Sheets & control de duplicados
│   │   │   ├── check-dni/route.ts    # GET: Verificación previa de DNI en Sheets
│   │   │   └── geocode/
│   │   │       ├── reverse/route.ts  # Reverse geocoding lat/lng -> Dirección/Distrito
│   │   │       └── search/route.ts   # Autocompletado de direcciones
│   │   ├── globals.css               # Tailwind CSS, Glassmorphism & correcciones responsive/iOS
│   │   ├── layout.tsx                # Branding Header/Footer IDP Aeropuerto & Metadata
│   │   └── page.tsx                  # Wizard Censo Flow Manager
│   ├── components/
│   │   ├── LandingHero.tsx           # Sección explicativa inicial con logo
│   │   ├── ConsentModal.tsx          # Modal de consentimiento pastoral
│   │   ├── CensusForm.tsx            # Wizard stepper de 4 pasos
│   │   ├── StepPersonalData.tsx      # Paso 1: Formulario datos personales
│   │   ├── StepLocation.tsx          # Paso 2: Mapa Leaflet & GPS/Dirección
│   │   ├── StepConfirmation.tsx      # Paso 3: Resumen & Aceptación
│   │   ├── ThankYouCard.tsx          # Paso 4: Agradecimiento pastoral
│   │   └── InteractiveMap.tsx        # Componente mapa Leaflet cliente
│   └── lib/
│       ├── googleSheets.ts           # Cliente autenticado Google Sheets API v4
│       ├── validations.ts            # Esquemática Zod (DNI, Email, Edad)
│       └── types.ts                  # Interfaces TypeScript
├── .env.example                      # Plantilla de variables de entorno (Local y Vercel)
└── README.md                         # Documentación completa del proyecto
```

---

## ✝️ Créditos

Desarrollado con dedicación para la **Iglesia de Dios de la Profecía Aeropuerto** — Censo Geográfico 2026.
