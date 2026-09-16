#!/bin/bash
echo "======================================================="
echo "  CoNote - Limpieza y Retirada de Recursos Locales"
echo "======================================================="
echo ""

echo "1. Deteniendo contenedores Docker y removiendo redes/volúmenes..."
docker compose down --rmi local --volumes --remove-orphans

echo ""
echo "2. Removiendo contenedores efímeros de ejecución Lambda de SAM..."
docker rm -f $(docker ps -a -q --filter "name=sam-local") 2>/dev/null || true

echo ""
echo "3. Limpiando carpetas temporales de compilación (.aws-sam)..."
rm -rf .aws-sam

echo ""
echo "======================================================="
echo "  [OK] Limpieza completada. Todos los recursos locales fueron retirados."
echo "======================================================="
