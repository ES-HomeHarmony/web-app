# Stage 1: Build the React app
FROM --platform=linux/amd64 node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 3000

CMD ["node", "app.js"]