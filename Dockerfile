# Here we are getting our node as Base image
FROM node:14

# Creating a new directory for app files and setting path in the container
RUN mkdir /app

# setting working directory in the container
WORKDIR /app

# grant permission of node project directory to node user
COPY . .

# installing the dependencies into the container
RUN yarn

# container exposed network port number
EXPOSE 3000

# command to run within the container
CMD [ "npm", "start" ]