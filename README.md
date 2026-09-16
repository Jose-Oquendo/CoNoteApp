# CoNotes (Tablero colaborativo)

Aplicativo para prueba técnica - Vacante: Desarrollador.

## 1. Instrucciones para la instalación y ejecución del entorno local

El aplicativo está construido utilizando el framework ReactJS y ExpressJS. Para levantar el entorno local, siga los siguientes pasos:

### Requisitos Previos

- Node.js (versión 20 o superior recomendada)
- Gestor de paquetes de Node (npm, yarn o pnpm)
- Docker (Docker Desktop)

### Pasos de Instalación del proyecto en entorno local

1. Ubicarse en el directorio raíz del proyecto (`/CoNote`) mediante una terminal de comandos.
2. Abrir aplicativo empaquetado mediante el comando de Docker Compose:

   ```bash
   docker compose up --build
   ```
Docker se encargará de levantar el **Frontend**, el **Backend** y el servicio de **AWS SAM Local** de forma automática.

3. Espere a la instlacion de los contenedores. La aplicación estará disponible en la dirección local proporcionada por la consola (por defecto `http://localhost:3000`)

- **Aplicación Web (Frontend)**: [http://localhost:3000](http://localhost:3000)
- **API Backend**: [http://localhost:5000](http://localhost:5000)
- **AWS SAM Local API (Lambda)**: [http://localhost:3001/metrics](http://localhost:3001/metrics)

4. Para finalizar la ejecicion utilize la cominacion ctrl + c

4. Limpie los archivos y contenedores creados con el ejecutable:

- **En Windows**:
  ```cmd
  .\cleanup.bat
  ```
- **En Linux / macOS**:
  ```bash
  chmod +x cleanup.sh
  ./cleanup.sh
  ```

## 2 Probar entorno AWS SAM

Para simplificar la ejecución en local, se han creado lanzadores automáticos:

- **En Windows**:
  ```cmd
  .\sam-local.bat
  ```
- **En Linux / macOS**:
  ```bash
  chmod +x sam-local.sh
  ./sam-local.sh
  ```

## 3 Cuentas de Demostración (Acceso Rápido)

Puedes iniciar sesión utilizando cualquiera de estas dos cuentas (o usar los botones de **1-Clic** en la pantalla de Login):

| Rol | Correo | Contraseña | Permisos |
|---|---|---|---|
| **Administrador** | `admin@example.com` | `admin` | Acceso total: Tablero, Dashboard y Gestión de Usuarios |
| **Usuario** | `user@example.com` | `demo01` | Acceso a Tablero y Dashboard |


## 4 ¿Qué incluye este proyecto?

- **Tablero Compartido**: Lienzo libre con notas Post-it movibles mediante *Drag & Drop* que guardan su posición automáticamente.
- **Dashboard de Métricas**: Estadísticas calculadas en tiempo real a través de una función **AWS Lambda** emulada en local.
- **Gestión de Usuarios**: Administración de miembros del equipo con roles (Admin/User) y estado activo/inactivo.

---
