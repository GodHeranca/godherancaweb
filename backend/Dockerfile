# Use an official Node.js runtime as a parent image
FROM node:20

# Create a non-root user
RUN useradd -m appuser

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Change ownership of the app directory
RUN chown -R appuser:appuser /usr/src/app

# Switch to the non-root user
USER appuser

# Compile TypeScript
RUN npm run build

# Expose the desired port
EXPOSE 8080

# Command to run the application
CMD ["node", "dist/index.js"]