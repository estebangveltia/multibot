FROM node:18-bullseye-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force
COPY . .
RUN npm run build
ENV PORT=8084
EXPOSE 8084
CMD ["npm","start"]
