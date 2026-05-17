
# LumeApp - Leña Seca y Certificada

Aplicación web progresiva (PWA) para encontrar leña seca y certificada cerca de ti en la región de Temuco, Chile.

## ✨ Características Principales

### 🎯 Valor Propuesto
- **Leña certificada**: Calidad garantizada con medición profesional
- **Entrega rápida**: Conexión directa con vendedores locales
- **Precios transparentes**: Información clara y actualizada
- **Experiencia mobile-first**: Optimizada para dispositivos móviles

### 🗺️ Funcionalidades del Mapa
- Mapa interactivo con OpenStreetMap
- Marcadores con colores según certificación
- Geolocalización automática
- Filtros avanzados por especie, zona y precio
- Leyenda visual clara

### 💬 Contacto Directo
- Botón de WhatsApp prominente
- Mensajes precargados dinámicos
- Información completa del vendedor
- Cards flotantes con detalles

### 📊 Analytics Completo
- Firebase Analytics integrado
- Tracking de interacciones del usuario
- Métricas de conversión
- Optimización UX basada en datos

### 📱 PWA Instalable
- Instalación en dispositivos móviles
- Funciona sin conexión (mapa cacheado)
- Notificaciones push (preparado)
- Experiencia nativa

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 🛠️ Tecnologías

- **React 18** con TypeScript
- **Vite** para bundling y desarrollo
- **React Leaflet** + OpenStreetMap
- **Firebase Analytics** para métricas
- **Tailwind CSS** + shadcn/ui
- **Vite PWA** para instalación
- **React Router v7** para navegación

## 📱 Instalación PWA

1. Abre la app en tu navegador móvil
2. Toca el botón "Agregar a pantalla de inicio" o "Instalar app"
3. La app se instalará como una aplicación nativa

## 🎨 Diseño UX/UI

### Header con Valor
- Mensaje claro: "Leña Seca y Certificada"
- Elementos de confianza visibles
- Información de calidad garantizada

### Cards de Vendedores
- Información completa y visual
- Botón WhatsApp prominente
- Estados de certificación claros
- Precios y ubicaciones destacados

### Estados Vacíos Elegantes
- Mensajes informativos
- Llamados a acción claros
- Diseño consistente con la marca

### Responsive Completo
- Mobile-first approach
- Adaptable a desktop
- Touch targets optimizados
- Safe areas para dispositivos modernos

## 📊 Analytics y Métricas

### Eventos Tracked
- `screen_view`: Visualizaciones de pantalla
- `marker_click`: Interacciones con marcadores
- `filter_usage`: Uso de filtros
- `whatsapp_contact`: Contactos por WhatsApp
- `navigation`: Navegación entre secciones
- `geolocation`: Eventos de ubicación

### Métricas de Conversión
- Tasa de contacto por WhatsApp
- Uso de filtros por sesión
- Tiempo en pantalla del mapa
- Interacciones con vendedores

## 🔧 Configuración

### Firebase Analytics
```javascript
// Configurado en src/services/firebase.ts
// Variables de entorno necesarias:
// VITE_FIREBASE_API_KEY
// VITE_FIREBASE_AUTH_DOMAIN
// etc.
```

### PWA
- Service Worker automático
- Cache de mapa offline
- Manifest configurado
- Iconos optimizados

## 📈 Próximas Mejoras (Roadmap)

- [ ] Sistema de reseñas y calificaciones
- [ ] Integración con WhatsApp Business API
- [ ] Sistema de pedidos y pagos
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Soporte multi-idioma

## 🤝 Contribución

Proyecto desarrollado para validar el MVP de LumeApp. Para contribuciones o feedback, contacta al equipo de desarrollo.

## 📄 Licencia

Este proyecto es propiedad de LumeApp. Todos los derechos reservados.
  