# Use a base image with Node.js
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (to cache dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose the port
EXPOSE 3001

# Start the backend service
CMD ["node", "index.js"]
