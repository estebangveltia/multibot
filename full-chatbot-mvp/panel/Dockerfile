FROM node:18-bullseye-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
COPY views ./views
COPY public ./public
COPY .env .env

EXPOSE 8090
CMD ["npm", "start"]
