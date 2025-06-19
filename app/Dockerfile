# 1. Base image: Node.js LTS (puede ser la 18-alpine)
FROM node:18-alpine

# 2. Crear un directorio de trabajo
WORKDIR /usr/src/app

# 3. Copiar package.json y package-lock.json y luego instalar dependencias
COPY package.json ./
RUN npm install --production

# 4. Copiar el resto del código
COPY index.js ./

# 5. Exponer el puerto en el que la app escucha
EXPOSE 3000

# 6. Comando por defecto
CMD ["npm", "start"]
