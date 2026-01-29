# Team Tasks Frontend

**Tecnología utilizada: Angular**

Este es el frontend de la aplicación Team Tasks, desarrollado con Angular 21 que consume la API .NET para la gestión de tareas y proyectos de equipo.

## Características Implementadas

### Dashboard Principal
- **Tabla de carga por desarrollador**: Muestra desarrollador, tareas abiertas y complejidad total estimada con ordenamiento
- **Tabla de estado por proyecto**: Información de proyectos con resaltado visual cuando tareas abiertas > completadas
- **Tabla de riesgo de retraso**: Muestra desarrolladores en riesgo con HighRiskFlag destacado

### Vista de Tareas por Proyecto
- **Ruta**: `/projects/:id`
- **Tabla de tareas** con: Título, Asignado, Estado, Prioridad, Complejidad, Fechas
- **Filtros**: Por estado y desarrollador (dropdowns)
- **Paginación**: Control de páginas con tamaño configurable
- **Detalle de tarea**: Modal al hacer clic en una fila

### Formulario de Nueva Tarea
- **Acceso**: Botón "New Task" o ruta `/new-task`
- **Validación completa** con mensajes de error específicos
- **Campos requeridos**: Proyecto, Título, Asignado, Estado, Prioridad, Complejidad, Fecha vencimiento
- **Feedback visual**: Mensajes de éxito/error

### Calidad y Componentes Reutilizables
- **Componente de tabla reutilizable**: Uso transversal en todas las vistas
- **Pipe personalizado**: `date_format` para formateo de fechas consistentes
- **Responsive design**: Adaptable a móviles y tablets
- **TypeScript** tipado completo
- **SCSS** para estilos organizados

### Gráficos (Opcional)
- **Gráfico de doughnut**: Distribución de tareas por estado en vista de proyecto
- **Integración Chart.js** vía ng2-charts
- **Tooltips informativos** con porcentajes

## Requisitos Previos

- Node.js 18+ 
- Angular CLI 21+
- API backend .NET corriendo en `http://localhost:44388`

## Instalación y Ejecución

1. **Instalar dependencias**:
```bash
npm install
```

2. **Iniciar servidor de desarrollo**:
```bash
npm start
```
o
```bash
ng serve --port 4203
```

3. **Abrir en navegador**:
   Navegar a `http://localhost:4203/`

La aplicación se recargará automáticamente al modificar archivos.

## Configuración de API

La URL base de la API está configurada en `src/app/services/api.service.ts`:
```typescript
private readonly apiUrl = 'http://localhost:44388/api';
```

Asegúrate que la API backend esté corriendo y accesible en esa dirección.

## Estructura del Proyecto

```
src/app/
├── components/
│   ├── dashboard/           # Vista principal Dashboard
│   ├── project-tasks/       # Vista de tareas por proyecto  
│   ├── new-task/           # Formulario nueva tarea
│   ├── table/              # Componente tabla reutilizable
│   └── task-status-chart/  # Gráfico de tareas por estado
├── models/                 # Tipos e interfaces TypeScript
├── pipes/                  # Pipes personalizados
├── services/              # Servicios HTTP
└── app.module.ts          # Configuración del módulo principal
```

## Build de Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## Testing

```bash
npm test
```

## Notas Técnicas

- **Versiones**: Angular 21, TypeScript 5.9, Node.js 18+
- **Estilos**: SCSS con diseño responsive y modern CSS Grid/Flexbox
- **Gráficos**: Chart.js 4.4 + ng2-charts 6.0
- **Validaciones**: Angular Forms con validadores personalizados
- **Manejo de errores**: Centralizado con mensajes de usuario amigables
- **Componentes Standalone**: Arquitectura moderna de Angular 21
- **Routing**: Angular Router con rutas protegidas y parámetros
- **HTTP Client**: HttpClient con interceptores para manejo de errores

## Endpoints de API Utilizados

- `GET /api/dashboard/developer-workload` - Carga por desarrollador
- `GET /api/dashboard/project-health` - Estado de proyectos
- `GET /api/dashboard/developer-delay-risk` - Riesgo de retraso
- `GET /api/projects` - Lista de proyectos
- `GET /api/projects/{id}/tasks` - Tareas de proyecto con paginación
- `POST /api/tasks` - Crear nueva tarea
- `GET /api/status/task` - Estados de tareas disponibles
- `GET /api/status/priority` - Prioridades disponibles