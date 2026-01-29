# Etapa 1: Compilación
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias con el flag para evitar errores de versiones de Angular 21
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar código y compilar
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servidor Web con Nginx
FROM nginx:alpine
# Copiar configuración de Nginx (asegúrate de tener el nginx.conf que creamos)
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/team-tasks-frontend /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]