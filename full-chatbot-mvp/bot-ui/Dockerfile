FROM node:18-bullseye-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY src ./src
COPY .env .env
EXPOSE 8084
CMD ["npm", "start"]
