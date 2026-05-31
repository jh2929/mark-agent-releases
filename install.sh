#!/bin/bash
set -e

echo "=================================================="
echo "   Instalando MARK-0 Agent (Propiedad de Jhezdev) "
echo "=================================================="

# 1. Definir rutas de instalación
BIN_DIR="$HOME/.local/bin"
ALIAS_NAME="mark"

# 2. Descargar el binario precompilado y cerrado desde el repositorio de distribución
echo "Descargando binario seguro desde GitHub Releases..."
mkdir -p "$BIN_DIR"

# URL directa al ejecutable en el nuevo repositorio de releases públicas
BINARY_URL="https://github.com/jh2929/mark-agent-cli/releases/latest/download/mark"

if ! curl -# -L "$BINARY_URL" -o "$BIN_DIR/$ALIAS_NAME"; then
    echo "Error: No se pudo descargar el binario. Verifica tu conexión a internet."
    exit 1
fi

# 3. Dar permisos de ejecución al binario
chmod +x "$BIN_DIR/$ALIAS_NAME"

# 4. Asegurar que ~/.local/bin está en el PATH del usuario
SHELL_RC=""
if [[ "$SHELL" == */zsh ]]; then
    SHELL_RC="$HOME/.zshrc"
elif [[ "$SHELL" == */bash ]]; then
    SHELL_RC="$HOME/.bashrc"
fi

if [ -n "$SHELL_RC" ] && [ -f "$SHELL_RC" ]; then
    if ! grep -q "$BIN_DIR" "$SHELL_RC"; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$SHELL_RC"
        echo "PATH actualizado en $SHELL_RC."
    fi
fi

echo "=================================================="
echo "   ¡Instalación de MARK-0 Completada con Éxito!   "
echo "   Abre una nueva terminal o ejecuta: source $SHELL_RC"
echo "   Para iniciar el agente usa el comando: mark      "
echo "=================================================="
