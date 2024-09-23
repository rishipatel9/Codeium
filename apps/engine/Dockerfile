
FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN apt-get update && \
    apt-get install -y python3 gcc g++ openjdk-11-jdk && \
    rm -rf /var/lib/apt/lists/*

COPY . .

RUN chmod +x dist/run_in_docker.sh

EXPOSE 3001

CMD ["npm", "start"]
