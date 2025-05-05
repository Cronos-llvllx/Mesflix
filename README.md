# Mesflix
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.18.
---
Hector Daniel Gomez Medina
---
Mesflix es un servicio de streaming , hecho con HTML, SCSS con TypeScript y Angular. Es desarrollado como parte de un bootcamp de Mega con Liderly para aprender las bases de la programacion y aprender Angular para hacierlo con una mejor experiencia mas robusta y escalable.
***
## Requerimientos tecnicos
| Requerimientos | Todo lo que usaste |
|----------------| --------------------|
| - Responsividad. - Performance. -  Implementacion de asincronos. - RXJS, - Testing, 50 % de testing code coverage en el proyecto.               | Lenguajes de programación: HTML, SCSS , TypeScript, Angular.
Frameworks o librerías: Angular 18.
Herramientas de diseño: Draw.io para la elaboracion de mi mockup.
Software o IDE: Visual Studio Code.
Recursos adicionales: https://developer.mozilla.org/en-US/docs/Web/HTML. https://developer.mozilla.org/en-US/docs/Web/CSS. https://angular.dev/. https://lenguajehtml.com/|
## Como instalar?
### 1. Clona el repositorio: En la terminal o linea de comandos ejecuta(asegurate de tener git instalado en tu computadora)
git clone https://github.com/Cronos-llvllx/Mesflix.git
### 2. Accede a la carpeta del proyecto:
cd Mesflix ( bash)
### 3. Abre el proyecto en algun IDE como VS Code
code . (bash)
### 4. Instala dependencias
 Asegurate que las carpetas y todos los archivos se hayan descargado correctamente. Despues ejecuta en la terminar para instalar todas las dependencias necesarias para el proyecto npm install.(asegurate de tener Node.js y npm instalados)
### 5. Ejecuta el proyecto
Ejecuta en la terminal ng serve
## Mockup
(![Mockup](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/MockUpMesflixAngular.png)

---

## Capturas de pantalla
### 1- Ingreso Y Registro (Simulado)
Es un login simulado, en el cual pones lo que sea en user y password y te rediccionara a la pagina selection user. Los botones de inicio de sesion con github no funcionan por el momento. 
![LOGIN](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/LoginA.png)
![Register](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/RegistroA.png)
### 2- Selection USER
En este caso despues de pasar por el login nos redirecciona a la pagina seleccionar usuario en donde debemos seleccionar el usuario que deseamos y nos redigira a la pagina principal catalog.
![ChooseUser](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/ChooseUser.png)
### 3- Pagina principal Catalog
En este caso despues de pasar por el selection user nos redirecciona a la pagina principal en la cual  nos muestra los generos al darle clic a la figura nos redirige hacia las peliculas en cuestion.
![Catalog](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/Catalogo.png)
### 4- Visualizacion de peliculas
Se vera asi al darle clic al genero requerido, donde se muestra imagen  titulo y descripcion y debajo los botones Ver, ocultar y favorito. En este caso para agregar a favoritos hay que darle click al boton con la Estrella favorito y para quitarlo de favoritos solo es dandole clic de nuevo al mismo boton.
![Movies](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/VisualizacionPeliculas.png)
### 5- Favoritos
En este caso hay que primero darle clic a un genero, despues darle clic al boton de favoritos debajo de la pelicula que deseamos agregar a favoritos y por ultimo darle clic al boton favoritos del lado de cada pelicula y despues ir a la pestana del navbar favoritos donde apareceran los que seleccionaste.
![Favorites](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/FavoritosA1.png)
![Favorites1](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/Favoritos1.png)
### 6- Responsive
En el tema responsive use la consola del navegador y probe la pagina en un dispositivo Pixel 7 y un Ipad.
![Responsive](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/ResponsiveCelA.png)
![Responsive1](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/ResponsiveIpadA.png)
### 7- RXJS & Implementacion asincronos
![RXJS](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/RXJSyAsincronismo.png)
### 8- Testing code coverage
![CC1](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/TestHTML.png)
![CC2](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/KarmaTest1.png)

---


## Proceso que seguiste para hacerlo
El proceso de este sprint lo senti un poco mas diferente, ya que tuve que dedicar mas tiempo a la documentacion y investigacion, porque al principio conceptos de hilo principal, asincronismo y el RXJS es algo confuso al inicio al igual como el unit testing. Para lo del testing me base principalmente en lo que nos enseno el challenger en las clases y dentro de lo que cabe pude realizarlo de buena forma con algunas complicaciones pero cumpli con los objetivo. Para el asincronismo el proceso fue empece importando Rxjs y lo que iba a utilizar en este caso el Observable, despues cree el observable con retraso la funcion getMoviesObservable con un return que hacia el retraso 1 segundo y despues me suscribia y manejaba el estado de la funcion con isLoading=true , .suscribe({}) y isLoading=true en este caso simule la espera de la carga de la API para recibir la informacion ya que es un uso comun para aplicar y entender el concepto de hilos asincronos muestro un texto de "cargando peliculas" y despues las muestro para no dejar al usuario esperando mucho tiempo.

## Tabla de sprint review
| Sprint | ¿Qué salió bien? | ¿Qué no salió bien? | ¿Qué puedo mejorar? |
|--------|------------------|---------------------|---------------------|
|Sprint 3|Logre los objetivos marcados por el challenger y siento que termine de comprender los conceptos de asincronia y las bases de testing. | Siento que tardo un poco mas de mi tiempo estimado lo que me hace a veces dejar algunas cosas en el backlog. | Me gustaria aprender sobre buenas practicas y buen uso de frameworks como angular asi como metricas de seguridad.|


