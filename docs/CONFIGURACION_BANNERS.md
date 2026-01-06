# Configuración de Banners del Home

## 📋 Descripción

Sistema de gestión de banners para la página de inicio del CTT-Admin. Permite configurar 3 banners diferentes con **múltiples imágenes** cada uno, títulos, descripciones y botones de acción a través de un formulario por pasos con diseño mejorado.

## 🎯 Características

- ✅ **Formulario por pasos** (3 pasos) con stepper visual mejorado
- ✅ **Múltiples imágenes por banner** con botones agregar/eliminar
- ✅ **Validación en cada paso** antes de avanzar
- ✅ **Vista previa de imágenes** en tiempo real
- ✅ **Notificaciones toast** para feedback del usuario
- ✅ **Carga de datos existentes** desde la API
- ✅ **Diseño responsive** con Tailwind CSS
- ✅ **Navegación entre pasos** con indicadores visuales
- ✅ **Tarjetas individuales** para cada imagen con todos sus campos

## 🎨 Mejoras del Diseño

### Stepper Mejorado
- **Círculos más grandes** (h-12 w-12) con mejor visibilidad
- **Animaciones suaves** con transiciones y scale en el paso activo
- **Colores diferenciados:**
  - Paso actual: Azul con shadow y scale
  - Pasos completados: Verde con checkmark
  - Pasos pendientes: Gris
- **Líneas de progreso** horizontales entre pasos
- **Indicadores visuales** claros del estado actual

### Sistema de Múltiples Imágenes

#### Banner 1 (Principal)
- Botón "Agregar Imagen" en la parte superior
- Cada imagen en una tarjeta con fondo gris claro
- Botón "Eliminar" individual (si hay más de 1)
- Vista previa automática al ingresar URL
- Numeración de imágenes (Imagen 1, Imagen 2, etc.)

#### Banner 2 y 3 (Secundario y Terciario)
- Botón "Agregar Imagen" en el header
- Cada imagen en una **tarjeta grande** con:
  - Borde visible y shadow
  - Header con título y botón eliminar
  - Todos los campos: imagen, título, subtítulo, descripción, botón
  - Vista previa de imagen
  - Espaciado generoso para mejor legibilidad

## 📁 Archivos Creados

```
src/
├── api/
│   └── banners.js              # Servicios API para banners (GET, PUT)
├── hooks/
│   └── useBannerForm.js        # Hook personalizado con lógica del formulario
├── pages/
│   └── ConfiguracionHome.jsx   # Página del formulario por pasos
```

## 🔧 Configuración

### 1. Navegación
Se agregó un subitem en el menú de Configuración:

```javascript
// src/constants/navigation.js
{ 
  name: "Configuración", 
  path: "/dashboard/configuracion",
  subItems: [
    { name: "Configuración Home", path: "/dashboard/configuracion/home" },
  ]
}
```

### 2. Rutas
Se añadió la ruta en `App.jsx`:

```javascript
<Route path="configuracion/home" element={<ConfiguracionHome />} />
```

## 📊 Estructura de Datos

### Request Body (PUT /posts)

```json
{
  "banner": {
    "subtitulo": "Generamos desarrollo",
    "titulo": "Centro de transferencia CTT",
    "boton": {
      "texto": "Conocer más",
      "direccion": "enlace"
    },
    "imagenes": [
      {
        "imagen": "https://ejemplo.com/imagen1.jpg"
      }
    ]
  },
  "banner2": {
    "imagenes": [
      {
        "imagen": "https://ejemplo.com/imagen2.jpg",
        "titulo": "Conocimiento",
        "subtitulo": "Generamos desarrollo",
        "descripcion": "Centro de transferencia CTT comprometido",
        "boton": {
          "texto": "Ver más",
          "direccion": "local"
        }
      }
    ]
  },
  "banner3": {
    "imagenes": [
      {
        "imagen": "https://ejemplo.com/imagen3.jpg",
        "titulo": "Generando conocimiento",
        "subtitulo": "Impulsa tus habilidades",
        "descripcion": "Descripción del banner",
        "boton": {
          "texto": "conocer más",
          "direccion": "conocer"
        }
      }
    ]
  }
}
```

## 🎨 Componentes del Formulario

### Paso 1: Banner Principal (Hero)
- Subtítulo
- Título Principal
- Texto del Botón
- Enlace del Botón
- URL de la Imagen (con vista previa)

### Paso 2: Banner Secundario
- URL de la Imagen (con vista previa)
- Título
- Subtítulo
- Descripción (textarea)
- Texto del Botón
- Enlace del Botón

### Paso 3: Banner Terciario
- URL de la Imagen (con vista previa)
- Título
- Subtítulo
- Descripción (textarea)
- Texto del Botón
- Enlace del Botón

## 🚀 Uso

1. **Acceder al formulario:**
   - Navegar a Dashboard → Configuración → Configuración Home

2. **Completar cada paso:**
   - Llenar todos los campos requeridos
   - Verificar la vista previa de las imágenes
   - Hacer clic en "Siguiente" para avanzar

3. **Guardar configuración:**
   - En el paso 3, hacer clic en "Guardar Configuración"
   - Se mostrará una notificación de éxito

## 🔄 API Endpoints

### GET `/posts`
Obtiene la configuración actual de banners.

**Response:**
```json
{
  "banner": { ... },
  "banner2": { ... },
  "banner3": { ... }
}
```

### PUT `/posts`
Actualiza la configuración de banners.

**Request Body:** Ver estructura de datos arriba

## ✅ Validaciones

El formulario valida en cada paso:

- **Paso 1:** Subtítulo, título, datos del botón e imagen son obligatorios
- **Paso 2:** Todos los campos son obligatorios
- **Paso 3:** Todos los campos son obligatorios

Si falta algún campo, se muestra una notificación de advertencia y no permite avanzar.

## 🎯 Características Técnicas

### Hook `useBannerForm`
- Manejo del estado de los 3 banners
- Navegación entre pasos
- Validaciones
- Carga de datos existentes
- Actualización de campos individuales
- Envío a la API

### Componentes UI
- **Stepper:** Indicador visual del progreso
- **Vista previa de imágenes:** Muestra la imagen cuando se ingresa una URL válida
- **Botones de navegación:** Anterior, Siguiente, Guardar
- **Loading states:** Indicadores de carga al obtener y guardar datos

## 📱 Responsive Design

El formulario es completamente responsive:
- En desktop: Campos del botón en 2 columnas
- En móvil: Todo en una columna
- Stepper se adapta al tamaño de pantalla

## 🐛 Manejo de Errores

- **Imágenes no disponibles:** Muestra placeholder si la URL falla
- **Error al cargar:** Muestra toast de error
- **Error al guardar:** Muestra toast con mensaje del error
- **Validación de formulario:** Toast de advertencia con campos faltantes

## 🔮 Futuras Mejoras

- [ ] Drag & drop para subir imágenes
- [ ] Upload de imágenes al servidor
- [ ] Editor de texto enriquecido para descripciones
- [ ] Múltiples imágenes por banner
- [ ] Vista previa en vivo del home
- [ ] Historial de cambios

## 📞 Notas Importantes

- El endpoint de la API es `/posts` (configurado en `src/api/banners.js`)
- Se requiere autenticación para acceder al formulario
- Las imágenes deben ser URLs públicas (no se suben archivos por ahora)
- Los cambios se aplican inmediatamente después de guardar
