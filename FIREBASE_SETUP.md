# Firebase Analytics Configuration

Para conectar Firebase Analytics, sigue estos pasos:

## 1. Crear proyecto en Firebase Console

1. Ve a https://console.firebase.google.com/
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Google Analytics en tu proyecto

## 2. Configurar Firebase en tu app

1. En Firebase Console, ve a "Configuración del proyecto" (ícono de engranaje)
2. Desplázate a "Tus apps" y haz clic en "Agregar app"
3. Selecciona "Web app" y registra tu app
4. Copia la configuración de Firebase SDK

## 3. Actualizar configuración

Edita el archivo `src/firebase.ts` y reemplaza la configuración de ejemplo con tus valores reales:

```typescript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id",
  measurementId: "G-XXXXXXXXXX"
};
```

## 4. Eventos trackeados

La app actualmente mide los siguientes eventos:

### Interacciones del mapa:
- `map_click` - Clicks en el mapa
- `marker_click` - Clicks en marcadores
- `map_zoom` - Cambios de zoom
- `map_move` - Movimientos del mapa
- `geolocation_success` - Geolocalización exitosa
- `geolocation_error` - Error de geolocalización

### Filtros y búsqueda:
- `filter_applied` - Aplicación de filtros
- `species_toggle` - Toggle de especies
- `zone_toggle` - Toggle de zonas
- `search_performed` - Búsquedas realizadas

### Flujo de usuario:
- `screen_view` - Vistas de pantalla
- `screen_time` - Tiempo en pantalla
- `flow_step` - Pasos del flujo de usuario
- `vendor_interaction` - Interacciones con vendedores

### Sesión:
- `session_start` - Inicio de sesión
- `session_end` - Fin de sesión

## 5. Verificar funcionamiento

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Deberías ver logs como: `Analytics: screen_view {screen_name: "map_screen", ...}`
4. En Firebase Console > Analytics > Events, deberías ver los eventos aparecer

## 6. Configuración de producción

Asegúrate de que en producción:
- Las reglas de seguridad de Firebase permitan el acceso desde tu dominio
- Google Analytics esté habilitado
- Los eventos se estén enviando correctamente

## Notas importantes

- Si Firebase no está configurado correctamente, los eventos se loguearán localmente con el prefijo "Analytics (offline)"
- La app funciona sin Firebase configurado (solo logging local)
- Los eventos incluyen timestamps y metadatos detallados para análisis UX