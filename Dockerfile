# Set base image
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of application code to working directory
COPY . .

# Expose port 3000
EXPOSE 3000

# Set command to run application
CMD ["npm", "start"]