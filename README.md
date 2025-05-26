# Mesflix
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.18.
---
Hector Daniel Gomez Medina
---
Mesflix es un servicio de streaming , hecho con HTML, SCSS, TypeScript, Angular para el frontend y para el backend C# con .Net y entityFramework junto con la Base de datos de T-Sql. Es desarrollado como parte de un bootcamp de Mega con Liderly para aprender las bases de la programacion y aprender Angular para hacierlo con una mejor experiencia mas robusta y escalable. Nuestro challenger y lider tecnico [@brujeriatech](https://github.com/josejesusguzman)
***

## Requerimientos Técnicos

| Sprint | Requerimientos |
|--------|-----------------------------------------------|
| Sprint 1 | con html, css y js vanilla, que sea usable, que tenga login  (simulado), no (angular, react , etc...) , subirlo a GitHub con docs(readme), no clon de netflix, amazon, etc. tomar tamanios en cuenta de pantalla.  |
| Sprint 2 | Responsividad, Migrar a Angular, TypeScript, concluir funcionalidades del menu que estan creados.  |
| Sprint 3 | Responsividad, Performance, Implementacion de asincronos, RXJS , Testing |
| Sprint 4 Base de datos | Seguridad en el login, Login con BD, Implementar lazy loading, Uso de T-SQL en la base de datos, Implementación y consumo de la BD |
| Sprint 5 C# | API en ASP.net o net core -MVC , conexion con el proyecto de angular, implementacion de login con backend, manejo de cors implementado, un solo repo, documentacion completa co swagger, mejoras a consideracion propia. |

## Tecnologías utilizadas

| Categoría | Detalles |
|-----------|------------------------------------------------------|
| **Lenguajes de programación** | HTML, SCSS, TypeScript, C#, T-SQL |
| **Frameworks / Librerías** | Angular 18, Entity Framework, .NET |
| **Herramientas de diseño** | Draw.io (mockups), [dbdiagram.io](https://dbdiagram.io/) (diagramas E-R) |
| **Software / IDE** | Visual Studio Code |
| **Software recomendado** | SQL Server Management Studio 20 |
| **Recursos adicionales** | [MDN HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS), [Angular Docs](https://angular.dev), [C# Docs](https://learn.microsoft.com/es-es/dotnet/csharp), [SQL Server T-SQL](https://learn.microsoft.com/en-us/sql/t-sql/language-reference?view=sql-server-ver16), [Entity Framework Docs](https://learn.microsoft.com/es-es/ef/) |

## APIs utilizadas
Este proyecto utiliza la API de [TMDB](https://www.themoviedb.org/) para obtener información sobre películas, incluyendo títulos, géneros, imágenes y descripciones.
Para más detalles sobre la API, visita la [documentación oficial](https://developer.themoviedb.org/docs).
## Como instalar?
### 1. Clona el repositorio: En la terminal o linea de comandos ejecuta(asegurate de tener git instalado en tu computadora)
git clone https://github.com/Cronos-llvllx/Mesflix.git
### 2. Accede a la carpeta del proyecto:
cd Mesflix ( bash)
### 3. Abre el proyecto en algun IDE como VS Code
code . (bash)
### Dependencias necesarias
Antes de clonar el repositorio, asegúrate de tener instaladas las siguientes herramientas:

## Dependencias del Proyecto Mesflix

### Backend (API C#)

## Dependencias del Proyecto Mesflix

### Backend (API C#)

| Paquete NuGet / Herramienta                       | Versión    | Descripción                                                        | Instalación / Página Oficial                                      |
|---------------------------------------------------|------------|--------------------------------------------------------------------|-------------------------------------------------------------------|
| Microsoft.NET.Sdk.Web                             | 9.0        | SDK para aplicaciones web con .NET                                 | [dotnet.microsoft.com](https://dotnet.microsoft.com/download)     |
| Microsoft.AspNetCore.Authentication.JwtBearer      | 9.0.5      | Autenticación JWT para ASP.NET Core                                | `dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer` |
| Microsoft.AspNetCore.OpenApi                      | 9.0.5      | Soporte para OpenAPI/Swagger en ASP.NET Core                       | `dotnet add package Microsoft.AspNetCore.OpenApi`                 |
| Microsoft.EntityFrameworkCore                     | 9.0.5      | ORM para acceso a bases de datos                                   | `dotnet add package Microsoft.EntityFrameworkCore`                |
| Microsoft.EntityFrameworkCore.Design              | 9.0.5      | Herramientas de diseño para EF Core                                | `dotnet add package Microsoft.EntityFrameworkCore.Design`         |
| Microsoft.EntityFrameworkCore.SqlServer           | 9.0.5      | Proveedor EF Core para SQL Server                                  | `dotnet add package Microsoft.EntityFrameworkCore.SqlServer`      |
| Microsoft.EntityFrameworkCore.Tools               | 9.0.5      | Herramientas de línea de comandos para EF Core                     | `dotnet add package Microsoft.EntityFrameworkCore.Tools`          |
| Swashbuckle.AspNetCore                            | 8.1.1      | Generación de documentación Swagger/OpenAPI                        | `dotnet add package Swashbuckle.AspNetCore`                      |
| BCrypt.Net-Next                                   | 4.0.3      | Hasheo seguro de contraseñas                                       | `dotnet add package BCrypt.Net-Next`                             |
| Microsoft.IdentityModel.Tokens                    | 7.0.0+     | Utilidades para manejo de tokens de seguridad                      | `dotnet add package Microsoft.IdentityModel.Tokens`              |

---

### Frontend (Angular)

| Paquete npm / Librería            | Versión      | Descripción                                                        | Instalación / Página Oficial                                      |
|-----------------------------------|--------------|--------------------------------------------------------------------|-------------------------------------------------------------------|
| @angular/cli                      | 17.x         | Herramienta para crear, construir y servir aplicaciones Angular    | `npm install -g @angular/cli`<br>[angular.io](https://angular.io) |
| @angular/core                     | 17.x         | Núcleo del framework Angular                                       | `npm install @angular/core`                                       |
| @angular/common                   | 17.x         | Funcionalidades comunes de Angular                                 | `npm install @angular/common`                                     |
| @angular/router                   | 17.x         | Enrutamiento para Angular                                          | `npm install @angular/router`                                     |
| @angular/forms                    | 17.x         | Manejo de formularios en Angular                                   | `npm install @angular/forms`                                      |
| @angular/platform-browser         | 17.x         | Renderizado en navegador                                           | `npm install @angular/platform-browser`                           |
| @angular/platform-browser-dynamic | 17.x         | Compilación dinámica en navegador                                  | `npm install @angular/platform-browser-dynamic`                   |
| rxjs                              | 7.x          | Programación reactiva y manejo de observables                      | `npm install rxjs`                                                |
| zone.js                           | 0.14.x       | Detección de cambios en Angular                                    | `npm install zone.js`                                             |
| core-js                           | 3.x          | Polyfills para compatibilidad con navegadores antiguos             | `npm install core-js`                                             |
| tslib                             | 2.x          | Librería de soporte para TypeScript                                | `npm install tslib`                                               |
| SCSS                              | latest       | Preprocesador CSS para estilos                                     | [sass-lang.com](https://sass-lang.com/install)                    |
| karma                             | 6.x          | Ejecutor de pruebas unitarias                                      | `npm install karma --save-dev`                                    |
| jasmine                           | 4.x          | Framework para pruebas unitarias                                   | `npm install jasmine-core --save-dev`                             |

---

### Otros requisitos

| Herramienta         | Versión      | Descripción                                  | Instalación / Página Oficial                                      |
|---------------------|--------------|----------------------------------------------|-------------------------------------------------------------------|
| Node.js y npm       | 20.x         | Para instalar y ejecutar dependencias Angular| [nodejs.org](https://nodejs.org/)                                 |
| .NET SDK            | 9.0          | Para compilar y ejecutar el backend          | [dotnet.microsoft.com](https://dotnet.microsoft.com/download)     |
| SQL Server          | 2019+        | Motor de base de datos                       | [microsoft.com/sql-server](https://www.microsoft.com/sql-server)  |
| Git                 | 2.40+        | Control de versiones                         | [git-scm.com](https://git-scm.com/downloads)                      |

---

### Otros requisitos

| Herramienta         | Descripción                                  | Instalación / Página Oficial                                      |
|---------------------|----------------------------------------------|-------------------------------------------------------------------|
| Node.js y npm       | Para instalar y ejecutar dependencias Angular| [nodejs.org](https://nodejs.org/)                                 |
| .NET SDK 9.0+       | Para compilar y ejecutar el backend          | [dotnet.microsoft.com](https://dotnet.microsoft.com/download)     |
| SQL Server          | Motor de base de datos                       | [microsoft.com/sql-server](https://www.microsoft.com/sql-server)  |
| Git                 | Control de versiones                         | [git-scm.com](https://git-scm.com/downloads)                      |



Para instalar las dependencias, generalmente se usan los siguientes comandos:
Frontend (Angular): npm install
Backend (API C#): dotnet restore (este comando restaura las dependencias NuGet especificadas en el archivo .csproj).
Asegúrate de que todos los archivos de configuración (package.json, .csproj, appsettings.json, etc.) estén presentes en el repositorio para que otros puedan instalar las dependencias correctamente.

Después de instalar las dependencias, puedes clonar el repositorio con:
(bash)
git clone https://github.com/Cronos-llvllx/Mesflix.git

### 5. Ejecuta el proyecto para el front-end y backend
Ejecuta en la terminal ng serve para el front-end con angular. Para el backend es con dotnet run con C#. Y estar conectado y iniciada la Base de datos.
### 6. Ejecuta el proyecto para la Base de Datos
#### 1️-. Instalar SQL Server
Asegúrate de tener SQL Server instalado en tu máquina. Puedes descargarlo desde aquí.
#### 2-. Restaurar la base de datos
Si compartes un archivo .bak (backup de SQL Server), los usuarios pueden restaurarlo con este comando en SSMS: 
RESTORE DATABASE MesflixDB
FROM DISK = 'C:\ruta\MesflixDB.bak'
WITH MOVE 'Mesflix_Data' TO 'C:\SQLData\Mesflix.mdf',
MOVE 'Mesflix_Log' TO 'C:\SQLData\Mesflix.ldf',
RECOVERY;
#### Si compartes un archivo .sql, pueden ejecutarlo en SSMS o en la terminal de SQL Server:
(sql)
CREATE DATABASE MesflixDB;
USE MesflixDB;
-- Ejecutar el script SQL aquí
#### 3-. Configurar la conexión en el backend
En el archivo de configuración de tu backend (appsettings.json en .NET), los usuarios deben actualizar la cadena de conexión:
json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=MesflixDB;User Id=sa;Password=TuContraseña;"
}
## Mockup
(![Mockup](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/MockUpMesflixAngular.png)

---

## Capturas de pantalla
### 1- Ingreso Y Registro con BD
Es un login que revisa primero si el usuario existe en la base de datos, si existe el usuario, en el cual pones lo que sea en user y password y te rediccionara a la pagina selection user. Tambien funciona el apartado de registro, rellenas todos los campos y le das crear y se crea un registro en la BD  . Los botones de inicio de sesion con redes sociales de abajo por el momento. 
![LOGIN](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/photosReadme/Login.png)
![Register](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/photosReadme/Registro.png)
### 2- Selection USER
En este caso despues de pasar por el login nos redirecciona a la pagina seleccionar usuario en donde debemos seleccionar el usuario que deseamos y nos redigira a la pagina principal catalog.
![ChooseUser](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/photosReadme/SelectionUser.png)
### 3- Pagina principal Catalog
En este caso despues de pasar por el selection user nos redirecciona a la pagina principal en la cual  nos muestra los generos que extraemos de la API de TMDB de peliculas al darle clic a la figura nos redirige hacia el genero de peliculas en cuestion.
![Catalog](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/photosReadme/catalogfirst.png)
![Catalog2](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/photosReadme/catalogsec.png)
### 4- Visualizacion de peliculas
Se vera asi al darle clic al genero requerido, donde se muestra el genero de titulo en este caso "accion" y en la parte de abajo foto, titulo de pelicula del lado izquierdo y del derecho 3 botones, ver, ocultar y favorito. Al darle el boton agregar se guardara en la BD y aparecera en la pestana de "Favoritos" del navbar.
![Movies](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/photosReadme/GenreMovies.png)
### 5- Favoritos
En este caso hay que primero darle clic a un genero, despues darle clic al boton de favoritos del lado derecho de la pelicula que deseamos agregar y por ultimo nos vamos a la pestana de "Favoritos" del navbar de la parte de arriba.
![Favorites](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/photosReadme/favorites.png)
# Mesflix - Aplicación de Streaming de Películas

## Características Implementadas en Sprint 4

En este sprint, nos hemos enfocado en mejorar el rendimiento y la seguridad de la aplicación. A continuación, se detallan las implementaciones clave:

---

### 1. Lazy Loading (Carga Diferida) en Angular
Objetivo: Mejorar el tiempo de carga inicial de la aplicación al cargar módulos de funcionalidad solo cuando son necesarios.
Implementación:
Se ha implementado Lazy Loading para el módulo de autenticación. Esto significa que el código relacionado con las páginas de Login y Registro no se carga hasta que el usuario navega explícitamente a estas secciones.

* **Rutas de Autenticación (`/auth`):**
    * Las rutas bajo `/auth` (como `/auth/login` y `/auth/register`) ahora se cargan de forma diferida.
    * **Archivo Principal de Rutas:** La configuración de `loadChildren` se encuentra en `src/app/app.routes.ts`.
        ```typescript
        // En src/app/app.routes.ts
        // ...
        {
          path: 'auth',
          loadChildren: () => import('./auth/auth.routes').then(mod => mod.AUTH_ROUTES)
        },
        // ...
        ```
      Archivo de Rutas de Autenticación: Las rutas específicas para login y registro (que utilizan componentes standalone) están definidas en `src/app/auth/auth.routes.ts`.
        ```typescript
        // En src/app/auth/auth.routes.ts
        import { Routes } from '@angular/router';
        import { AuthComponent } from '../pages/auth/auth.component';
        import { LoginComponent } from '../pages/login/login.component';
        import { RegisterComponent } from '../pages/register/register.component';

        export const AUTH_ROUTES: Routes = [
          {
            path: '',
            component: AuthComponent, // Componente layout para login/registro
            children: [
              { path: 'login', component: LoginComponent },
              { path: 'register', component: RegisterComponent },
              { path: '', redirectTo: 'login', pathMatch: 'full' }
            ]
          }
        ];
        ```
      Componente Layout (`AuthComponent`): Se utiliza `src/app/pages/auth/auth.component.ts` como un componente de layout para las vistas de login y registro, permitiendo mantener estilos consistentes y un `<router-outlet>` para cargar los componentes específicos.

  Verificación:
    * Al cargar la aplicación inicialmente, el "chunk" de JavaScript correspondiente a las rutas de autenticación (ej. `chunk-auth-routes.js` o similar) no se descarga.
    * Este chunk se descarga y se ejecuta solo cuando se navega a una ruta bajo `/auth`. Esto se puede observar en la pestaña "Network" de las herramientas de desarrollador del navegador. (Puedes incluir una captura de pantalla de la pestaña Network mostrando la carga del chunk.).

---

### 2. Seguridad en el Login
Objetivo: Implementar un flujo de autenticación seguro utilizando JSON Web Tokens (JWT) para proteger los endpoints del backend y las rutas del frontend.
Implementación:
La seguridad del login se ha implementado a través de varios componentes y capas:

* **Backend (API C# - `ApiMesflix`):**
    * **Generación de Tokens JWT:**
        * Tras un login exitoso (verificación de email y contraseña hasheada con BCrypt), el `AuthController.cs` genera un token JWT.
        * El token incluye claims como `UserId`, `Email`, `FirstName`, `LastName` y un tiempo de expiración.
        * La generación utiliza una clave secreta, un emisor (`Issuer`) y una audiencia (`Audience`) definidos en `appsettings.json` (y `appsettings.Development.json`).
        * **Archivo:** `ApiMesflix/Controllers/AuthController.cs` (método `Login`)
    * **Validación de Tokens JWT:**
        * La configuración para validar los tokens JWT se encuentra en `ApiMesflix/Program.cs`.
        * Se utiliza `AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(...)` para configurar los parámetros de validación (emisor, audiencia, clave de firma, tiempo de vida).
        * El middleware `app.UseAuthentication()` y `app.UseAuthorization()` se ha añadido al pipeline de la aplicación.
        * **Archivo:** `ApiMesflix/Program.cs`
    * **Protección de Endpoints:**
        * Endpoints que requieren autenticación (como los del futuro `FavoritesController` o el `TestDataController` de prueba) se protegen con el atributo `[Authorize]`.
        * Esto asegura que solo las peticiones con un token JWT válido puedan acceder a estos recursos.
        * **Ejemplo:** `ApiMesflix/Controllers/TestDataController.cs` (método `GetProtectedData`) y `ApiMesflix/Controllers/FavoritesController.cs`.

* **Frontend (Aplicación Angular - `Mesflix`):**
    * **Servicio de Autenticación (`AuthService`):**
        * Maneja las llamadas a los endpoints de login y registro del backend.
        * Almacena el token JWT recibido en `localStorage` después de un login exitoso.
        * Provee un método `logout()` que elimina el token de `localStorage` y redirige al usuario.
        * Mantiene un estado observable (`isUserLoggedIn$`) para que otros componentes puedan reaccionar a los cambios de autenticación.
        * **Archivo:** `src/app/services/auth.service.ts`
    * **Interceptor HTTP (`AuthInterceptor`):**
        * Intercepta todas las peticiones HTTP salientes.
        * Si el usuario está logueado y la petición va a la API del backend, adjunta automáticamente el token JWT a la cabecera `Authorization` como un "Bearer token".
        * **Archivo:** `src/app/auth.interceptor.ts`
        * **Configuración:** Proveído en `src/app/app.config.ts`.
    * **Route Guards (`AuthGuard`):**
        * Implementa la interfaz `CanActivate` para proteger rutas en el frontend.
        * Utiliza `AuthService.isLoggedIn()` para verificar si el usuario está autenticado.
        * Si el usuario no está autenticado, lo redirige a la página de login.
        * **Archivo:** `src/app/auth.guard.ts`
        * **Aplicación:** En `src/app/app.routes.ts` (o rutas de módulos específicos) en la propiedad `canActivate` de las rutas protegidas (ej. `/select-user`, `/catalog`, `/favorites`).

* **Flujo General:**
    1.  Usuario se registra o inicia sesión a través del frontend.
    2.  El backend valida credenciales y emite un JWT.
    3.  El frontend almacena el JWT.
    4.  Para acceder a rutas/endpoints protegidos, el `AuthInterceptor` del frontend envía el JWT.
    5.  El `AuthGuard` del frontend previene el acceso a rutas si no hay token.
    6.  El backend valida el JWT. Si es válido, permite el acceso al endpoint y devuelve los datos solicitados.

---
### 8- Testing code coverage
![CC1](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/TestHTML.png)
![CC2](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/KarmaTest1.png)
### 9- Diagrama E-R
![ER](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/DiagramaER-MesflixDB.png)

---


## Proceso que seguiste para hacerlo
Sin duda este ha sido el Sprint mas dificil hasta ahora, el proceso que segui fue primer dividir las tareas en subtareas conforme a lo que nos habia pedido el challenger del sprint 4, despues fui a varias fuentes de informacion, cursos , paginas y documentacion ya que habia algunas implementaciones e instalaciones que no sabia que necesitaba hasta que lo hice. Despues tuve un problema con la instalacion de MySQL por lo cual tuve que instalarlo en un contenedor y de ahi usar mi BD local.
Fue un proceso lento que fui implementado cosas como el hash de las contrasenas, pero que me arrojaba algunos errores entonces tenia que ir viendo y ajustando que hacia mal. Sin duda me ayudan muchos mis apuntes y los cursos como los recursos, pero lo mas importante es programar, asi realmente aprendes con errores del mundo real.


## Tabla de sprint review
| Sprint | ¿Qué salió bien? | ¿Qué no salió bien? | ¿Qué puedo mejorar? |
|--------|------------------|---------------------|---------------------|
|Sprint 4|Logre los objetivos marcados por el challenger y corregi las fallas que me marco el challenger. Entendi de que se encarga el back y el front, algo que antes me confundia. | Me salieron muchos errores, dolores de cabeza y desvelos, hubo cosas que no entendia porque dejaban de funcionar, creo que a veces subestimo la complejidad de algunas cosas. | Mejorar mis tests. |


