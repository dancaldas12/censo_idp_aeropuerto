#!/usr/bin/env bash
echo "=============================================="
echo "  Censo Geográfico - Iglesia IDP Aeropuerto   "
echo "=============================================="

if [ ! -f .env.local ]; then
    echo "[!] Archivo .env.local no encontrado. Copiando desde .env.example..."
    cp .env.example .env.local
    echo "[✓] Archivo .env.local creado. Por favor configura tus credenciales de Google Sheets."
fi

echo "Selecciona modo de ejecución:"
echo "1) Docker Compose (Recomendado)"
echo "2) Desarrollo Local (npm run dev)"
read -p "Opción [1-2]: " choice

if [ "$choice" = "1" ]; then
    echo "[+] Ejecutando docker compose up --build -d..."
    docker compose up --build -d
    echo "[✓] Aplicación iniciada en http://localhost:3000"
else
    echo "[+] Instalando dependencias y ejecutando npm run dev..."
    npm install
    npm run dev
fi
