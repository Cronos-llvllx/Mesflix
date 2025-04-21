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
| - Migrar a Angular. - Usar TypeScript. -  Concluir funcionalidades de los menus que hayas puesto. - No clones de netflix,amazon, etc. - Responsive.               | Lenguajes de programación: HTML, SCSS , TypeScript, Angular.
Frameworks o librerías: Angular 18.
Herramientas de diseño: Draw.io para la elaboracion de mi mockup.
Software o IDE:Visual Studio Code.
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
![Movies](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/ViewMoviesA.png)
### 5- Favoritos
En este caso hay que primero darle clic a un genero, despues darle clic al boton de favoritos debajo de la pelicula que deseamos agregar a favoritos y por ultimo darle clic al boton favoritos del navbar para que hasta abajo de la pagina se muestren los favoritos.
![Favorites](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/FavoritosA1.png)
![Favorites1](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/FavoritosA2.png)
### 6- Responsive
En el tema responsive use la consola del navegador y probe la pagina en un dispositivo Pixel 7 y un Ipad.
![Responsive](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/ResponsiveCelA.png)
![Responsive1](https://github.com/Cronos-llvllx/Mesflix/blob/main/public/ResponsiveIpadA.png)

---


## Proceso que seguiste para hacerlo
El proceso que hice fue primero actualice mi MockUp se me ocurrieron algunas mejoras que pude hacerle a la estructura de la pagina, donde anote todos los errores que me salieron en la migracion, solucionaba 1 error y salian 3 mas, definitvamente es algo tedioso y estresante, por el conocimiento que se hay que tener para migrar de Angular como de Js, hubo funcionalidades que me salio mejor rehacerlas ya que typescript no permitia algunas malas practicas al hacer funciones y obliga Typarlas. Despues me asegure de cumplir con los requerimientos por pasos, dividi las tareas por dias es decir, migrar dia 1 y 2, terminar login dia 3 , terminar funcionalidades 4 y asi consecutivamente. Despues hice la estructura de carpetas y cree los componentes, services, data, interfaces. Despues empece a migrar archivo por archivo y por ultimo implemente las imagenes y las optimice para que pesaran menos ya que uso muchas en mi repo y proyecto por el momento ya que no implemente una API.

## Tabla de sprint review
| Sprint | ¿Qué salió bien? | ¿Qué no salió bien? | ¿Qué puedo mejorar? |
|--------|------------------|---------------------|---------------------|
|Sprint 2|La estructura de carpetas y organizacion de archivos, la migracion a Angular 18 y seguimiento del Mockup. | Detallado de los disenos del SCSS, gestion del tiempo en tareas ya que me ponia dia o horas en especifico pero a veces salen cosas que no controlo como errores. | Mejorar definitivamente el diseno y los espacios que abarca cada section, entender mas angular ya que es algo complejo entender del todo Interfaces, componentes, anticiparme a los errores inesperados por la perdida de tiempo.|


