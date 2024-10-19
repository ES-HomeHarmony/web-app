# Stage 1: Build the React app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the built app with a lightweight image
FROM nginx:alpine

# Copy the build output to the Nginx HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port on which the app will run
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]