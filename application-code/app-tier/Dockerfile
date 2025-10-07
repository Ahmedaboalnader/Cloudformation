FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4000

CMD ["node", "index.js"]
