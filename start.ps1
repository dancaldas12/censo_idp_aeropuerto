# Script de inicio para Windows PowerShell
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  Censo Geográfico - Iglesia IDP Aeropuerto   " -ForegroundColor Yellow
Write-Host "==============================================" -ForegroundColor Cyan

if (-not (Test-Path .env.local)) {
    Write-Host "[!] Archivo .env.local no encontrado. Creando desde .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env.local
    Write-Host "[✓] Archivo .env.local creado. Por favor configura tus credenciales de Google Sheets." -ForegroundColor Green
}

$choice = Read-Host "Selecciona el modo de ejecución: `n [1] Docker Compose (Recomendado) `n [2] Desarrollo Local (npm run dev) `n Opción (1 o 2)"

if ($choice -eq "1") {
    Write-Host "[+] Construyendo e iniciando contenedores Docker..." -ForegroundColor Cyan
    docker compose up --build -d
    Write-Host "[✓] Aplicación ejecutándose en http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "[+] Instalando dependencias y ejecutando servidor dev..." -ForegroundColor Cyan
    npm install
    npm run dev
}
