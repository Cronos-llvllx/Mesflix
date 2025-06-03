# --- Etapa de Build ---
# Usa la imagen del SDK de .NET para compilar la aplicación
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

# Copia el archivo .csproj desde la raíz del contexto de compilación
# a la raíz del WORKDIR actual (/app) DENTRO DE LA IMAGEN.
# Tu archivo .csproj se llama 'ApiMesflix.csproj'.
COPY ApiMesflix.csproj ./
# Alternativamente, si solo tienes un .csproj en el contexto, podrías usar:
# COPY *.csproj ./
# Limpia la caché de NuGet, luego restaura
RUN dotnet nuget locals all --clear
RUN dotnet restore ./ApiMesflix.csproj

# Restaura las dependencias del proyecto.
# El comando se ejecuta dentro de /app, y ApiMesflix.csproj está ahí.
RUN dotnet restore ./ApiMesflix.csproj
# O si usaste COPY *.csproj ./ y solo hay uno:
# RUN dotnet restore

# Copia TODO el resto del código fuente desde el contexto de compilación
# (la carpeta ApiMesflix local) al WORKDIR actual (/app) DENTRO DE LA IMAGEN.
COPY . ./

# Publica la aplicación para release.
# El comando se ejecuta dentro de /app.
RUN dotnet publish ./ApiMesflix.csproj -c Release -o /app/publish 

# --- Etapa de Runtime ---
# Usa la imagen de runtime de ASP.NET Core, que es más ligera
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build-env /app/publish .

# Puerto que expone la API DENTRO del contenedor
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Comando para ejecutar la aplicación
# Asegúrate que 'ApiMesflix.dll' sea el nombre correcto de tu ensamblado principal
ENTRYPOINT ["dotnet", "ApiMesflix.dll"]