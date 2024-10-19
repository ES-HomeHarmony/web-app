# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# # Install a lightweight HTTP server to serve the built app
# RUN npm install -g serve

# Expose the port on which the app will run
EXPOSE 3000

# Command to serve the app
# CMD ["serve", "-s", "build", "-l", "3000"]
