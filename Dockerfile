# Step 1: Use Node.js to build the React app
FROM node:18 AS build

# Accept build-time environment variable
ARG REACT_APP_SERVER_URL

# Set working directory
WORKDIR /app

# Copy only package.json to install dependencies first (for caching)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Set the env var so React can access it during build
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL

# Build the production-ready React app
RUN npm run build

# Step 2: Use Nginx to serve the app
FROM nginx:alpine

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built React files into nginx's public folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
