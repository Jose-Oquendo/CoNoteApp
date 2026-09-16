@echo off
echo =======================================================
echo   CoNote - Limpieza y Retirada de Recursos Locales
echo =======================================================
echo.

echo 1. Deteniendo contenedores Docker y removiendo redes/volumenes...
docker compose down --rmi local --volumes --remove-orphans

echo.
echo 2. Removiendo contenedores epimeros de ejecucion Lambda de SAM...
for /f "tokens=*" %%i in ('docker ps -a -q --filter "name=sam-local"') do docker rm -f %%i >nul 2>&1

echo.
echo 3. Limpiando carpetas temporales de compilacion (.aws-sam)...
if exist .aws-sam rmdir /s /q .aws-sam

echo.
echo =======================================================
echo   [OK] Limpieza completada. Todos los recursos locales fueron retirados.
echo =======================================================
