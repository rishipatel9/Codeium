
FROM node:14
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN chmod +x dist/run_in_docker.sh

EXPOSE 3001

CMD ["npm", "start"]
