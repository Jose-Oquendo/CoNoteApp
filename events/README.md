# 📂 Guía y Explicación de la Carpeta `/events`

Esta carpeta contiene archivos de **eventos simulados (Mock Events)** formateados en JSON para probar funciones **AWS Lambda** localmente utilizando el comando `sam local invoke`.

---

## 🎯 ¿Para qué sirve la carpeta `/events`?

Cuando ejecutas una función Lambda en la nube de AWS (por ejemplo, detrás de un **AWS API Gateway**), AWS le entrega a la función un objeto JavaScript conocido como **`event`**. Este evento contiene toda la información de la petición HTTP: la ruta solicitada, el método (GET, POST), los encabezados, la dirección IP del cliente y el cuerpo de la petición.

Para probar la función Lambda en tu equipo local **sin depender de un despliegue en la nube**, el archivo `dashboard-metrics-event.json` imita exactamente la estructura de ese evento real de AWS.

---

## 📄 Explicación Detallada de `events/dashboard-metrics-event.json`

A continuación se explica la función de cada campo dentro del archivo `dashboard-metrics-event.json`:

```json
{
  // 1. Versión del formato de payload de API Gateway (HTTP API v2.0)
  "version": "2.0",

  // 2. Ruta y método HTTP registrado en la plantilla template.yaml
  "routeKey": "GET /metrics",

  // 3. Ruta exacta que solicitó el cliente
  "rawPath": "/metrics",

  // 4. Parámetros de la URL (Query Parameters, ej: ?notes=[...])
  "rawQueryString": "",

  // 5. Encabezados HTTP de la petición
  "headers": {
    "accept": "application/json",
    "content-type": "application/json",
    "host": "127.0.0.1:3001",
    "user-agent": "aws-sam-cli-local-test"
  },

  // 6. Contexto de la petición generado por API Gateway
  "requestContext": {
    "accountId": "123456789012",       // ID simulado de la cuenta de AWS
    "apiId": "sam-local-api",          // ID del API Gateway local
    "domainName": "127.0.0.1",          // Dominio local
    "http": {
      "method": "GET",                // Método HTTP
      "path": "/metrics",             // Ruta solicitada
      "protocol": "HTTP/1.1",         // Protocolo de red
      "sourceIp": "127.0.0.1"         // Dirección IP del cliente
    },
    "stage": "$default",               // Etapa de despliegue (Stage)
    "time": "14/Sep/2026:18:20:00 +0000" // Estampa de tiempo de la petición
  },

  // 7. Cuerpo de la petición (Null para peticiones GET sin cuerpo)
  "body": null,

  // 8. Indica si el cuerpo viene codificado en Base64 (false para JSON plano)
  "isBase64Encoded": false
}
```

---

## 🛠️ Comandos para Usar este Evento

Para probar la función Lambda de forma directa en tu consola utilizando este archivo de evento:

```bash
sam local invoke DashboardMetricsFunction -e events/dashboard-metrics-event.json
```

---

## 💡 Ventajas de Usar Archivos de Eventos

1. **Pruebas Automatizadas Rápidas**: Permite verificar que la función Lambda responde correctamente sin necesidad de abrir un navegador o usar Postman.
2. **Reproducción de Casos de Prueba**: Puedes crear diferentes archivos de evento (ej: `events/event-con-notas.json`, `events/event-error.json`) para probar distintos escenarios.
