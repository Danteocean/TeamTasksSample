# TeamTasksSample - Sistema de Gestión de Tareas de Equipo

## Descripción de la Tecnología

TeamTasksSample es una aplicación full-stack construida con **ASP.NET Core 8.0** y **Angular 21** que gestiona registros de tareas y proyectos de equipo. La aplicación utiliza una arquitectura de microservicios con patrones modernos de acceso a datos, combinando Entity Framework Core para operaciones de escritura y Dapper para consultas de lectura optimizadas [1](#2-0) . [2](#2-1) .

## Arquitectura Full-Stack

La aplicación sigue una arquitectura en capas con separación clara de responsabilidades:

```
TeamTasksSample/
├── Backend (ASP.NET Core 8.0)
│   ├── TeamTasksSample/              # Web API layer - Controllers and endpoints
│   ├── CoreLibrary/                  # Business logic - Services and DTOs
│   ├── domain/                       # Entities and queries - Core domain objects
│   └── infrastructure/               # Data access - EF Core and repositories
└── Frontend (Angular 21)
    └── team-tasks-frontend/          # SPA Angular application
```

La arquitectura implementa el patrón CQRS (Command Query Responsibility Segregation) donde las operaciones de lectura usan Dapper para mayor rendimiento y las de escritura usan Entity Framework Core con el patrón UnitOfWork para garantizar la integridad transaccional [3](#2-2) . [4](#2-3) .

## Technology Stack

| Componente | Backend | Frontend | Versión | Propósito |
|------------|---------|----------|---------|-----------|
| **Framework** | ASP.NET Core | Angular | 8.0 / 21 | API Web RESTful / SPA |
| **Lenguaje** | C# | TypeScript | 10.0+ / 5.9 | Lenguajes principales |
| **Base de Datos** | SQL Server | - | 2022 | Almacenamiento de datos |
| **ORM** | Entity Framework Core | - | 8.0 | Operaciones de escritura |
| **Micro-ORM** | Dapper | - | 2.1.66 | Operaciones de lectura |
| **HTTP Client** | - | HttpClient | 21 | Comunicación API |
| **Charts** | - | Chart.js + ng2-charts | 4.4 + 6.0 | Visualización de datos |
| **Build System** | MSBuild | Angular CLI | - | Compilación y build |

## Backend - ASP.NET Core 8.0

### Organización de Carpetas

El proyecto sigue **Clean Architecture** con 4 capas principales [5](#2-4) :

```
TeamTasksSample/
├── TeamTasksSample/              # Capa de Presentación (API)
│   ├── Controllers/              # Controladores REST
│   └── Program.cs                # Punto de entrada
├── CoreLibrary/                  # Capa de Aplicación
│   ├── DTOs/                     # Data Transfer Objects
│   ├── Features/                 # Servicios de negocio
│   ├── Interface/                # Interfaces
│   ├── Mappings/                 # AutoMapper profiles
│   └── ServiceRegistration.cs    # DI configuration
├── domain/                       # Capa de Dominio
│   ├── Entities/                 # Entidades del modelo relacional
│   ├── Querys/                   # Consultas Dapper optimizadas
│   └── Wrappers/                 # Response wrappers
└── infrastructure/               # Capa de Infraestructura
    ├── infrastructure/
    │   ├── Repositories/         # Repository pattern
    │   └── Setting/              # DbContext configuration
```

### API Endpoints

#### ProjectsController

| Método | Ruta | Propósito | Request Body |
|--------|------|-----------|--------------|
| GET | `/api/projects` | Obtener resumen de proyectos | - |
| GET | `/api/projects/{projectId}/tasks` | Consultar tareas de proyecto con filtros | `ProjectTasksDtoRequest` [6](#2-5)  |

#### DashboardController

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | `/api/dashboard/developer-workload` | Obtener carga de trabajo de desarrolladores |
| GET | `/api/dashboard/project-health/{projectId}` | Obtener salud del proyecto |
| GET | `/api/dashboard/developer-delay-risk` | Obtener riesgo de retraso de desarrolladores |

#### StatusController

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | `/api/status/ProjectStatuses` | Obtener estados de proyectos |
| GET | `/api/status/TaskPriorities` | Obtener prioridades de tareas |
| GET | `/api/status/TaskStatuses` | Obtener estados de tareas [7](#2-6)  |

## Frontend - Angular 21

### Características Implementadas

#### Dashboard Principal
- **Tabla de carga por desarrollador**: Muestra desarrollador, tareas abiertas y complejidad total estimada con ordenamiento [8](#2-7) 
- **Tabla de estado por proyecto**: Información de proyectos con resaltado visual cuando tareas abiertas > completadas
- **Tabla de riesgo de retraso**: Muestra desarrolladores en riesgo con HighRiskFlag destacado

#### Vista de Tareas por Proyecto
- **Ruta**: `/projects/:id`
- **Tabla de tareas** con: Título, Asignado, Estado, Prioridad, Complejidad, Fechas [9](#2-8) 
- **Filtros**: Por estado y desarrollador (dropdowns)
- **Paginación**: Control de páginas con tamaño configurable
- **Detalle de tarea**: Modal al hacer clic en una fila

#### Formulario de Nueva Tarea
- **Acceso**: Botón "New Task" o ruta `/new-task`
- **Validación completa** con mensajes de error específicos
- **Campos requeridos**: Proyecto, Título, Asignado, Estado, Prioridad, Complejidad, Fecha vencimiento
- **Feedback visual**: Mensajes de éxito/error

### Estructura del Proyecto Frontend

```
team-tasks-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/           # Vista principal Dashboard
│   │   │   ├── project-tasks/       # Vista de tareas por proyecto  
│   │   │   ├── new-task/           # Formulario nueva tarea
│   │   │   ├── table/              # Componente tabla reutilizable
│   │   │   └── task-status-chart/  # Gráfico de tareas por estado
│   │   ├── models/                 # Tipos e interfaces TypeScript
│   │   ├── pipes/                  # Pipes personalizados
│   │   ├── services/              # Servicios HTTP
│   │   └── app.module.ts          # Configuración del módulo principal
│   ├── environments/
│   │   ├── environment.ts         # Base environment
│   │   ├── environment.dev.ts     # Development config
│   │   └── environment.prod.ts    # Production config
│   └── index.html                 # HTML entry point [10](#2-9) 
├── angular.json                   # Angular CLI configuration
├── package.json                   # npm dependencies
└── tsconfig.json                  # TypeScript configuration
```

### Configuración de Angular

#### Build y Development Server

El frontend está configurado con Angular CLI 21 con las siguientes características [11](#2-10) :

- **Output path**: `dist/team-tasks-frontend`
- **Development server port**: 4203
- **Proxy configuration**: Redirige `/api/*` a `https://localhost:44388/api` [12](#2-11) 
- **Environment configurations**: production y development con file replacements

#### Dependencias Principales

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@angular/core` | `^21.1.0` | Core framework |
| `@angular/common` | `^21.1.0` | Utilidades comunes |
| `@angular/forms` | `^21.1.0` | Formularios reactivos |
| `@angular/router` | `^21.1.0` | Routing y navegación |
| `chart.js` | `^4.4.0` | Librería de gráficos |
| `ng2-charts` | `^6.0.0` | Wrapper Angular para Chart.js [13](#2-12)  |

## Configuración y Ejecución

### Backend (ASP.NET Core 8.0)

```bash
# Restaurar paquetes
dotnet restore

# Ejecutar aplicación
dotnet run --project TeamTasksSample

# La API estará disponible en https://localhost:44388
```

### Frontend (Angular 21)

```bash
# Instalar dependencias
cd team-tasks-frontend
npm install

# Iniciar servidor de desarrollo
npm start
# o
ng serve --port 4203

# Abrir en navegador: http://localhost:4203/
```

La aplicación se recargará automáticamente al modificar archivos [14](#2-13) .

## Integración Frontend-Backend

### Configuración de API

La URL base de la API está configurada en el frontend para comunicarse con el backend [15](#2-14) :

```typescript
private readonly apiUrl = 'http://localhost:44388/api';
```

### Endpoints Utilizados por el Frontend

- `GET /api/dashboard/developer-workload` - Carga por desarrollador
- `GET /api/dashboard/project-health` - Estado de proyectos
- `GET /api/dashboard/developer-delay-risk` - Riesgo de retraso
- `GET /api/projects` - Lista de proyectos
- `GET /api/projects/{id}/tasks` - Tareas de proyecto con paginación
- `POST /api/tasks` - Crear nueva tarea
- `GET /api/status/task` - Estados de tareas disponibles
- `GET /api/status/priority` - Prioridades disponibles [16](#2-15) 

## DTOs Principales

### Backend DTOs

```csharp
public class TasksAddDtoRequest
{
    public int ProjectId { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public int AssigneeId { get; set; }
    public int TaskStatusId { get; set; }
    public int TaskPriorityId { get; set; }
    public int EstimatedComplexity { get; set; }
    public DateTime DueDate { get; set; }
    public string? CreatedBy { get; set; }
}
``` [17](#2-16) 

## Notes

### Patrones de Diseño Implementados
- Repository Pattern: `IUnitOfWork` [18](#2-17) 
- UnitOfWork: Coordinación de transacciones
- CQRS: Separación de lecturas/escrituras
- Dependency Injection en servicios y controladores [19](#2-18) 

### Entidades Principales
- **Task**: Representa una tarea con propiedades como `TaskId`, `Title`, `Description`, `AssigneeId`, `TaskStatusId`, `TaskPriorityId`, `EstimatedComplexity`, `DueDate` [20](#2-19) 
- **Projects**: Contenedor de tareas del equipo
- **Developers**: Miembros del equipo de desarrollo

### Servicios de Negocio
- **ProjectsService**: Gestiona operaciones relacionadas con proyectos y tareas [21](#2-20) 
- **DashboardService**: Proporciona métricas y análisis del proyecto [22](#2-21) 
- **StatusService**: Gestiona catálogos de estados y prioridades [23](#2-22) 

### Características Técnicas del Frontend
- **Componentes reutilizables**: TableComponent, TaskStatusChartComponent
- **Pipe personalizado**: `date_format` para formateo de fechas consistentes
- **Responsive design**: Adaptable a móviles y tablets
- **TypeScript** tipado completo
- **SCSS** para estilos organizados
- **Gráficos interactivos** con Chart.js y ng2-charts [24](#2-23) 

Wiki pages you might want to explore:
- [Frontend Application (Angular) (Danteocean/TeamTasksSample)](/wiki/Danteocean/TeamTasksSample#4)
- [Frontend Configuration (Danteocean/TeamTasksSample)](/wiki/Danteocean/TeamTasksSample#4.5)

### Citations

**File:** TeamTasksSample.sln (L6-21)
```text
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "TeamTasksSample", "TeamTasksSample\TeamTasksSample.csproj", "{44DCF6E8-2983-45E8-92A6-4A1424354984}"
EndProject
Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "src", "src", "{02EA681E-C7D8-13C7-8484-4AC65E1B71E8}"
EndProject
Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "1- DistributedServices", "1- DistributedServices", "{0752415F-B92F-45AC-A372-D2EFCA563B3B}"
EndProject
Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "2 - Core", "2 - Core", "{E38188F8-F0C8-48C6-ACAE-42F330657C34}"
EndProject
Project("{2150E333-8FDC-42A3-9474-1A3956D46DE8}") = "3 - Infrastructure", "3 - Infrastructure", "{0183BAA4-655B-4C34-B3FF-CDC9C9C10D52}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "CoreLibrary", "CoreLibrary\CoreLibrary.csproj", "{4BB95B03-8D65-77DA-EBA4-9B5FCF75AFF1}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "Domain", "domain\Domain.csproj", "{E528BBC3-1C26-8C35-F682-23718816ADCD}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "infrastructure", "infrastructure\infrastructure\infrastructure.csproj", "{90327BCE-1B5E-2ED7-C3F4-CEE86A9C2A14}"
EndProject
```

**File:** TeamTasksSample/Controllers/StatusController.cs (L18-43)
```csharp
    [HttpGet("ProjectStatuses")]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetProjectStatuses()
    {
        return Ok(await _statusService.GetProjectStatuses());
    }

    [HttpGet("TaskPriorities")]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetTaskPriorities()
    {
        return Ok(await _statusService.GetTaskPriorities());
    }

    [HttpGet("TaskStatuses")]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(Response<bool>), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetTaskStatuses()
    {
        return Ok(await _statusService.GetTaskStatuses());
    }
```

**File:** team-tasks-frontend/README.md (L9-12)
```markdown
### Dashboard Principal
- **Tabla de carga por desarrollador**: Muestra desarrollador, tareas abiertas y complejidad total estimada con ordenamiento
- **Tabla de estado por proyecto**: Información de proyectos con resaltado visual cuando tareas abiertas > completadas
- **Tabla de riesgo de retraso**: Muestra desarrolladores en riesgo con HighRiskFlag destacado
```

**File:** team-tasks-frontend/README.md (L27-38)
```markdown
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

```

**File:** team-tasks-frontend/README.md (L45-64)
```markdown
##  Ejecución

1. **Clonar proyecto**:
```bash
 https://github.com/Danteocean/TeamTasksSample.git
```

2. **Ingresar en la carpeta**:
```bash
cd TeamTasksSample
```


3. **Ejecutar el docker compose**:
```bash
docker compose build --no-cache
docker compose up

```

La url del Back es : http://localhost:8080/swagger/index.html
La url del Front es : http://localhost:4200/dashboard

- `GET /api/dashboard/developer-workload` - Carga por desarrollador
- `GET /api/dashboard/project-health` - Estado de proyectos
- `GET /api/dashboard/developer-delay-risk` - Riesgo de retraso
- `GET /api/projects` - Lista de proyectos
- `GET /api/projects/{id}/tasks` - Tareas de proyecto con paginación
- `POST /api/tasks` - Crear nueva tarea
- `GET /api/status/task` - Estados de tareas disponibles
- `GET /api/status/priority` - Prioridades disponibles
```