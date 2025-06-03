# Etapa 1: Compilación de la aplicación Angular
# Usa una imagen de Node.js. Elige una versión LTS o la que uses para desarrollo.
# Alpine es una buena opción por ser ligera.
FROM node:22-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia package.json y package-lock.json (o yarn.lock)
# Esto aprovecha el cache de Docker si no cambian las dependencias
COPY package*.json ./

# Instala las dependencias del proyecto Angular
RUN npm install

# Copia todo el código fuente de la aplicación Angular al contenedor
COPY . .

# Compila la aplicación Angular para producción
# El output estará en /usr/src/app/dist/Mesflix/browser (o como se llame tu proyecto en angular.json)
# Revisa tu angular.json -> projects -> [nombre-proyecto] -> architect -> build -> options -> outputPath
# Para Angular 17+, a menudo es 'dist/nombre-del-proyecto/browser'
RUN npm run build -- --configuration production

# Etapa 2: Servir la aplicación Angular con Nginx
# Usa una imagen ligera de Nginx
FROM nginx:1.28-alpine

# Elimina la configuración por defecto de Nginx del directorio de configuración
RUN rm /etc/nginx/conf.d/default.conf

# Copia tu configuración personalizada de Nginx (si la tienes)
# Este archivo 'nginx.conf' debe estar en la misma carpeta que este Dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Establece el directorio de trabajo para los archivos estáticos
WORKDIR /usr/share/nginx/html

# Elimina el contenido HTML por defecto de Nginx
RUN rm -rf ./*

# Copia los archivos compilados de la aplicación Angular (de la etapa 'build')
# a la carpeta raíz de Nginx.
# Asegúrate que el path '/usr/src/app/dist/mesflix/browser/' coincida con tu 'outputPath'
# en angular.json. El nombre de la carpeta 'mesflix' puede variar.
COPY --from=build /usr/src/app/dist/mesflix/ ./

# Expone el puerto 80 (puerto por defecto de Nginx)
EXPOSE 80

# Comando por defecto para iniciar Nginx y mantenerlo en primer plano
CMD ["nginx", "-g", "daemon off;"]