# Step 1: Use a node image to build the React app
FROM node:18 AS build

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Build the React app
RUN npm run build

# Step 7: Set up the production environment using a lightweight web server (Nginx)
FROM nginx:alpine

# Step 8: Copy the build files from the previous step into the Nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80 for the Nginx container
EXPOSE 80

# Step 10: Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
