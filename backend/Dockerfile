FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npx tsc --outDir build
EXPOSE 5000
CMD ["npm", "start"]