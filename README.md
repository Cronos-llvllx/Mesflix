# Mesflix
Mesflix es un servicio de streaming , hecho con HTML, SCSS, TypeScript, Angular para el frontend y para el backend C# con .Net y entityFramework junto con la Base de datos de T-Sql. Es desarrollado como parte de un bootcamp de Mega con Liderly para aprender las bases de la programacion y aprender Angular para hacierlo con una mejor experiencia mas robusta y escalable. Nuestro challenger y lider tecnico [@brujeriatech](https://github.com/josejesusguzman)
---
Hector Daniel Gomez Medina
---
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
| **Herramientas de diseño** | Draw.io (mockups), [dbdiagram.io](https://dbdiagram.io/) (diagramas E-R) , [paletto.com](https://paletton.com/) |
| **Software / IDE** | Visual Studio Code |
| **Herramientas adicionales** | Docker Desktop, kubernetes |
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

### Configuración y Despliegue con Docker y Kubernetes (Local)
Esta sección describe los pasos para construir las imágenes Docker de la aplicación Mesflix (frontend y backend) y desplegarlas en un clúster local de Kubernetes (como el que se incluye con Docker Desktop o Minikube).

### Prerrequisitos
Antes de comenzar, asegúrate de tener instalado lo siguiente en tu máquina:

1-Docker Desktop (o Docker Engine si usas Linux y Minikube/Kind por separado):
  Asegúrate de que Docker esté corriendo.
  Si usas Docker Desktop, habilita Kubernetes desde la configuración de Docker Desktop.
2-kubectl: La herramienta de línea de comandos para interactuar con Kubernetes.
  Si instalaste Docker Desktop con Kubernetes, kubectl ya debería estar configurado para apuntar a tu clúster local.
  Puedes verificar con kubectl cluster-info.
3-SDK de .NET: Necesario para construir el backend si se hacen cambios en el código fuente (ej. .NET 6, 7 u 8, según tu proyecto ApiMesflix).
  Node.js y npm/yarn: Necesario para construir el frontend si se hacen cambios en el código fuente (Mesflix-frontend).
4-Git: Para clonar este repositorio.
5-(Opcional, para Base64) Una forma de codificar en Base64 (Linux/macOS tienen base64 en la terminal; Windows puede usar PowerShell o herramientas online con precaución para datos sensibles).
Para este paso ya tienes que haber clonado el repo.
# Configurar Secretos de Kubernetes

La aplicación requiere secretos para la cadena de conexión a la base de datos y la clave JWT. Estos valores no se incluyen directamente en el repositorio por seguridad.

## 1. Creación del archivo `mesflix-secrets.yaml` y `mesflix-configmap.yaml`
En la raíz del proyecto (o donde tengas tus archivos YAML de Kubernetes), encontrarás un archivo llamado `mesflix-secrets.yaml.example` (o `mesflix-secrets.template.yaml`).  
Copia este archivo y renómbralo a `mesflix-secrets.yaml`:

bash
cp mesflix-secrets.yaml.example mesflix-secrets.yaml
# 2. Editar mesflix-secrets.yaml , `mesflix-configmap.yaml` y añadir valores
Necesitarás codificar en Base64 tu cadena de conexión a la base de datos y tu clave secreta JWT.
# Para la cadena de conexión
echo -n 'Server=TU_SERVIDOR_BD;Database=MesflixDB;User ID=TU_USUARIO;Password=TU_PASSWORD;TrustServerCertificate=True' | base64

# Para la clave JWT (usa una clave larga y segura)
echo -n 'TU_CLAVE_SECRETA_JWT_MUY_LARGA_Y_ALEATORIA' | base64
# Codificación en Base64 (Windows - PowerShell)
$ConnectionString = "Server=TU_SERVIDOR_BD;Database=MesflixDB;User ID=TU_USUARIO;Password=TU_PASSWORD;TrustServerCertificate=True"
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($ConnectionString))

$JwtKey = "TU_CLAVE_SECRETA_JWT_MUY_LARGA_Y_ALEATORIA"
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($JwtKey))
# 3. Reemplazar valores en mesflix-secrets.yaml y mesflix-configmap.yaml
# mesflix-secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: mesflix-secrets
type: Opaque
data:
  DB_CONNECTION_STRING: TU_CADENA_DE_CONEXION_EN_BASE64  # <-- Reemplaza
  JWT_KEY: TU_CLAVE_JWT_EN_BASE64                  # <-- Reemplaza
Nota sobre la Base de Datos:
La cadena de conexión debe apuntar a una instancia de SQL Server accesible. Si el backend corre en Kubernetes y la BD es un contenedor Docker fuera de Kubernetes:

Usa host.docker.internal si usas Docker Desktop.
Usa la IP de tu máquina host si usas Minikube.

# 4. (Opcional) Configurar la Base de Datos
Si necesitas crear el esquema de la BD, puedes encontrar el script en database/mesflix_schema.sql y ejecutarlo contra SQL Server.
## Mockup
(![Mockup](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/MockUpMesflixAngular.png)
# 5. Construir las imágenes Docker
Backend (api-mesflix)
Navega a la carpeta donde está el Dockerfile del backend:
docker build -t api-mesflix:latest ./ApiMesflix
Frontend (mesflix-frontend)
Navega a la carpeta donde está el Dockerfile del frontend:
docker build -t mesflix-frontend:latest ./Mesflix-Frontend
Para usuarios de Minikube
eval $(minikube -p <nombre_de_tu_perfil_minikube> docker-env)
# 6. Despliegue en Kubernetes
Asegúrate de estar en la carpeta con los archivos YAML de Kubernetes.
Aplicar el ConfigMap
kubectl apply -f mesflix-configmap.yaml
aplicar Secrets
kubectl apply -f mesflix-secrets.yaml
Desplegar el Backend 
kubectl apply -f api-mesflix-deployment.yaml
kubectl apply -f api-mesflix-service.yaml
Desplegar el Front-end
kubectl apply -f mesflix-frontend-deployment.yaml
kubectl apply -f mesflix-frontend-service.yaml
# 7. Verificar el Despliegue
Verificar los Pods
kubectl get pods -w
Si ves ImagePullBackOff o ErrImagePull, verifica que el nombre de la imagen en deployment.yaml coincida con la que construiste.
Verificar los Servicios
kubectl get services
api-mesflix-service probablemente sea de tipo ClusterIP.
mesflix-frontend-service podría ser de tipo LoadBalancer o NodePort.
# 8. Acceder a la Aplicación
Si mesflix-frontend-service es de tipo LoadBalancer
kubectl get services
Busca la EXTERNAL-IP para acceder a la app. Si usas Minikube, ejecuta:
minikube service mesflix-frontend-service
# 9. Solución de Problemas
Logs de los Pods
Si un pod está en estado CrashLoopBackOff o Error:
kubectl logs <nombre-del-pod>
Descripción del Pod
kubectl describe pod <nombre-del-pod>
Presta atención a la sección "Events" al final.
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
![Catalog](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/photosReadme/catalog.png)
### 4- Visualizacion de peliculas
Se vera asi al darle clic al genero requerido, donde se muestra el genero de titulo en este caso "accion" y en la parte de abajo foto, titulo de pelicula del lado izquierdo y del derecho 3 botones, ver, ocultar y favorito. Al darle el boton agregar se guardara en la BD y aparecera en la pestana de "Favoritos" del navbar.
![Movies](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/photosReadme/GenreMovies.png)
### 5- Favoritos
En este caso hay que primero darle clic a un genero, despues darle clic al boton de favoritos del lado derecho de la pelicula que deseamos agregar y por ultimo nos vamos a la pestana de "Favoritos" del navbar de la parte de arriba.
![Favorites](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/photosReadme/favorites.png)
# Mesflix - Aplicación de Streaming de Películas

## Características Implementadas en Sprint 5

En este sprint, nos hemos enfocado en mejorar el diseno UX/UI y la empaquetacion con docker y kubernetes. A continuación, se detallan las implementaciones clave:

Arquitectura del Backend (API ASP.NET Core)
El backend de Mesflix está desarrollado con ASP.NET Core, utilizando el patrón arquitectónico Modelo-Vista-Controlador (MVC) adaptado para la creación de APIs RESTful. En esta implementación:

Modelo: Representado por las clases de entidad (como User, UserFavorite) y el MesflixDbContext que maneja la lógica de acceso y manipulación de datos con Entity Framework Core.
Vista: En el contexto de esta API, las "vistas" son las respuestas HTTP que se envían al cliente. Estas respuestas están típicamente formateadas en JSON y van acompañadas de códigos de estado HTTP que indican el resultado de la operación (ej. 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized). La API no genera vistas HTML directamente.
Controlador: Se utilizan API Controllers (clases que heredan de ControllerBase y están decoradas con [ApiController]). Estos controladores (AuthController, FavoritesController, TestDataController) reciben las solicitudes HTTP, procesan la lógica de negocio (a menudo interactuando con los modelos o servicios), y devuelven las respuestas HTTP correspondientes.

AuthController:
Responsable de la autenticación y registro de usuarios.
Implementa endpoints como:
POST /api/auth/register: Para registrar nuevos usuarios. Recibe un UserRegisterDto y, si es exitoso, devuelve una respuesta indicando el éxito o los detalles del usuario creado.
POST /api/auth/login: Para iniciar sesión. Recibe un UserLoginDto, valida las credenciales y, si son correctas, genera y devuelve un token JWT (JSON Web Token) que el cliente utilizará para autenticar solicitudes posteriores.
FavoritesController:

Gestiona las películas favoritas de los usuarios.
Todos sus endpoints están protegidos y requieren un token JWT válido para ser accedidos (indicado por el atributo [Authorize]).
Implementa endpoints como:
GET /api/favorites: Obtiene la lista de IDs de películas favoritas del usuario autenticado.
POST /api/favorites: Añade una película a los favoritos del usuario. Recibe un AddFavoriteDto con el ID de la película.
DELETE /api/favorites/{movieId}: Elimina una película de los favoritos del usuario.
TestDataController:

Controlador de ejemplo para probar la autenticación y autorización.
Incluye:
Un endpoint público (GET /api/testdata/public).
Un endpoint protegido (GET /api/testdata/protected) que requiere autenticación.
3. Conexión a la Base de Datos
Entity Framework Core (EF Core): Se utiliza EF Core como ORM (Object-Relational Mapper) para interactuar con la base de datos SQL Server.
MesflixDbContext: Esta clase (ApiMesflix/Data/MesflixDbContext.cs) hereda de DbContext y define los DbSet para las entidades (como Users, UserFavorites), representando las tablas de la base de datos. También configura el modelo y las relaciones.
Cadena de Conexión: La cadena de conexión a la base de datos se configura en appsettings.Development.json para el entorno de desarrollo y se registra en Program.cs usando builder.Configuration.GetConnectionString("MesflixDbConnection"). Cuando se despliega en Kubernetes, esta cadena se provee a través de un Secret.
4. Implementación de Login con JWT (JSON Web Tokens)
Registro (/api/auth/register):
Recibe los datos del nuevo usuario.
Hashea la contraseña antes de guardarla en la base de datos por seguridad (usando una técnica de hashing como la que proporciona ASP.NET Core Identity o una librería similar).
Login (/api/auth/login):
Valida las credenciales del usuario contra los datos almacenados.
Si son válidas, genera un token JWT. Este token contiene "claims" (información sobre el usuario como su ID, nombre, roles, etc.) y está firmado digitalmente usando una clave secreta (Jwt:Key configurada en appsettings.Development.json o un Secret en Kubernetes).
También se configuran un Issuer (emisor) y Audience (audiencia) para el token, que se validan al autenticar las solicitudes.
Autenticación de Solicitudes:
El cliente (frontend) debe enviar este token JWT en la cabecera Authorization de cada solicitud a endpoints protegidos, usando el esquema Bearer (ej. Authorization: Bearer <token>).
El middleware de autenticación JWT configurado en Program.cs (AddAuthentication y AddJwtBearer) intercepta las solicitudes, valida el token (firma, expiración, issuer, audience) y establece la identidad del usuario.
5. Manejo de CORS (Cross-Origin Resource Sharing)
CORS es necesario para permitir que el frontend (que se ejecuta en un origen diferente, ej. http://localhost:4200) haga solicitudes a la API backend (ej. http://localhost:5268).
Se configura en Program.cs usando builder.Services.AddCors() y app.UseCors().
Se ha definido una política específica (MyAllowSpecificOrigins) que permite solicitudes desde el origen del frontend de desarrollo (http://localhost:4200), permitiendo cualquier cabecera y método.
6- Documentación de la API (Swagger/OpenAPI)
La API del backend de Mesflix está documentada utilizando Swagger (OpenAPI), lo que proporciona una interfaz de usuario interactiva para explorar y probar los diferentes endpoints.

Acceso a Swagger UI
Cuando el proyecto backend (ApiMesflix) se está ejecutando en tu entorno de desarrollo local, puedes acceder a la documentación interactiva de Swagger UI a través de tu navegador web en la siguiente URL:

http://localhost:port/swagger
(Asegúrate de que el puerto "port" coincida con el puerto en el que tu API se está ejecutando localmente, según tu ApiMesflix/Properties/launchSettings.json).
![swagger](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/SwaggerDocs.png)

Características y Uso
La interfaz de Swagger UI para Mesflix API (Mesflix API v1 OAS 3.0) ofrece las siguientes funcionalidades:

Listado de Controladores y Endpoints: Muestra todos los controladores disponibles (Auth, Favorites, TestData) y los endpoints HTTP (GET, POST, DELETE, etc.) asociados a cada uno.
Descripciones: Cada endpoint y sus parámetros están documentados con descripciones (si se han añadido comentarios XML en el código C# y se ha configurado Swagger para usarlos).
Modelos (Schemas): Describe la estructura de los DTOs (Data Transfer Objects) utilizados para las solicitudes y respuestas (ej. UserRegisterDto, UserLoginDto, UserResponseDto, AddFavoriteDto). Estos se pueden ver en la sección "Schemas" de Swagger UI.
Pruebas Interactivas ("Try it out"): Permite ejecutar solicitudes directamente desde el navegador para probar cada endpoint.
Autorización JWT:
Para los endpoints protegidos (marcados con un ícono de candado 🔒), Swagger UI está configurado para manejar la autenticación JWT.
Cómo usarlo:
Primero, ejecuta el endpoint POST /api/auth/login con credenciales válidas para obtener un token JWT.
Copia el token de la respuesta.
Haz clic en el botón "Authorize" (generalmente en la parte superior derecha de Swagger UI).
En el diálogo que aparece, en la sección "BearerAuth (apiKey)", pega tu token JWT completo, asegurándote de incluir el prefijo Bearer (ej. Bearer eyJhbGciOiJIUzI1NiIs...).
Haz clic en "Authorize" y luego cierra el diálogo.
Ahora podrás ejecutar los endpoints protegidos.
Esta configuración de Swagger se define en el archivo Program.cs del proyecto backend, donde se utiliza AddSwaggerGen() para configurar la generación de la documentación y la UI.

---
Estructuracion de carpetas: 
mesflix-project/                  # Carpeta raíz de tu repositorio Git
├── .git/                         # Carpeta de Git (autogenerada)
├── .gitignore                    # Archivo para especificar qué no subir a Git
│
├── ApiMesflix/                   # Carpeta raíz del proyecto Backend (.NET)
│   ├── Controllers/              # Controladores de tu API
│   ├── Data/                     # DbContext, migraciones (si usas EF Core)
│   ├── Dtos/                     # Data Transfer Objects
│   ├── Models/                   # Modelos de Entidad (clases que representan tus tablas)
│   ├── Properties/               # launchSettings.json, etc.
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── Program.cs
│   ├── ApiMesflix.csproj         # Archivo de proyecto .NET
│   └── Dockerfile                # Dockerfile para construir la imagen del backend
│
├── Mesflix-Frontend/             # Carpeta raíz del proyecto Frontend (Angular)
│   ├── angular.json              # Configuración del CLI de Angular
│   ├── package.json              # Dependencias y scripts de npm
│   ├── package-lock.json         # Lockfile de npm
│   ├── tsconfig.app.json         # Configuración de TypeScript para la app
│   ├── tsconfig.json             # Configuración base de TypeScript
│   ├── tsconfig.spec.json        # Configuración de TypeScript para pruebas
│   ├── .editorconfig
│   ├── .gitignore                # Gitignore específico del frontend (a menudo ya incluido en .gitignore raíz)
│   ├── karma.conf.js             # Configuración de Karma (testing)
│   ├── postcss.config.js         # Si usas PostCSS
│   ├── src/                      # Código fuente de Angular
│   │   ├── main.ts
│   │   ├── index.html
│   │   ├── styles.scss           # Estilos globales
│   │   │
│   │   ├── app/                  # Módulo raíz y componentes principales
│   │   │   ├── app.component.html
│   │   │   ├── app.component.scss
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts
│   │   │   │
│   │   │   ├── components/       # Componentes reutilizables (Navbar, Footer, etc.)
│   │   │   │   ├── navbar/
│   │   │   │   └── footer/
│   │   │   │
│   │   │   ├── pages/            # Componentes que representan páginas completas
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login/
│   │   │   │   │   └── register/
│   │   │   │   ├── catalog/
│   │   │   │   ├── favorites/
│   │   │   │   ├── profile/      # Para la nueva sección de perfil de usuario
│   │   │   │   │   ├── account-info/
│   │   │   │   │   ├── profiles-management/
│   │   │   │   │   ├── settings/
│   │   │   │   │   └── subscriptions/
│   │   │   │   ├── search/
│   │   │   │   ├── select-user/
│   │   │   │   └── genre-movies/
│   │   │   │   └── for-you/      # Si aún lo tienes o planeas
│   │   │   │
│   │   │   ├── services/         # Servicios de Angular (AuthService, TmdbService, etc.)
│   │   │   ├── interface/        # Interfaces TypeScript (Movie, Genre, User, etc.)
│   │   │   ├── guards/           # Guards de ruta (AuthGuard)
│   │   │   ├── interceptors/     # Interceptores HTTP (AuthInterceptor) - podrías ponerlo en `core` o `shared` también
│   │   │   └── auth/             # Si tienes rutas específicas para el módulo auth (auth.routes.ts)
│   │   │
│   │   ├── assets/               # Archivos estáticos (imágenes, fuentes, etc.)
│   │   │   └── img/              # Imágenes
│   │   │       ├── genres/       # Imágenes para géneros (si las usas)
│   │   │       └── profiles/     # Imágenes para avatares de perfil
│   │   │
│   │   └── environments/         # Archivos de entorno (dev, prod)
│   │       ├── environment.ts
│   │       └── environment.development.ts
│   │
│   └── Dockerfile                # Dockerfile para construir la imagen del frontend
│   └── nginx.conf                # (Si usas Nginx para servir el frontend en Docker)
│
├── kubernetes/                   # Carpeta para los manifests YAML de Kubernetes
│   ├── api-mesflix-deployment.yaml
│   ├── api-mesflix-service.yaml
│   ├── mesflix-frontend-deployment.yaml
│   ├── mesflix-frontend-service.yaml
│   ├── mesflix-configmap.yaml
│   ├── mesflix-secrets.yaml.example # PLANTILLA para los secretos, NO el archivo real con datos sensibles
│   └── (otros archivos como Ingress, PVCs si los necesitas más adelante)
│
├── database/                     # Scripts de base de datos, diagramas, etc.
│   ├── mesflix_schema.sql        # Tu script de esquema de BD
│   └── DiagramaER-Mesflix.png    # Tu diagrama E-R
│
└── README.md                     # Documentación principal del proyecto
---


---
### 8- Testing code coverage
![CC1](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/filesTesting/testing-codeCoverage.png)
![CC2](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/filesTesting/reporte-testing.png)
### 9- Diagrama E-R
![ER](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/DiagramaER-MesflixDB.png)


---


## Proceso que seguiste para hacerlo
Sin duda este fue un Sprint muy tedioso, el proceso que segui fue primer dividir las tareas en subtareas conforme a lo que nos habia pedido el challenger del sprint 5, despues fui a varias fuentes de informacion, cursos , paginas y documentacion ya que habia algunas implementaciones e instalaciones que no sabia que necesitaba hasta que lo hice. Despues tuve un problema con la implementacion de docker y kubernetes por el manejo de dependencias, incompatibilidades mucha configuracion de archivos y aprender nuevos conceptos. 


## Tabla de sprint review
| Sprint | ¿Qué salió bien? | ¿Qué no salió bien? | ¿Qué puedo mejorar? |
|--------|------------------|---------------------|---------------------|
|Sprint 5|La mejora de la navegacion de pagina y el diseno. | Tuve muchos problemas para implementar docker y kubernetes, errores de compatibilidad y manejo de dependencias pero al final parecio todo quedar solucionado.. | Enfocarme mas en el backlog o dedicarle un poco mas de tiempo. |


