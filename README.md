# Restaurants & Reviews API

> RESTful API for restaurant aggregation and their reviews

Built using Node.js/Express/Sequelize

## Usage

Fill in your config.env file based on the config.env.example file

```
# Install dependencies
npm install

# Run in development
npm run dev

# Run in production
npm start
```

## Docker MySQL Quick Start

```
# Pull the latest MySQL image
docker pull mysql:latest

# Start MySQL instance
docker run --name mysql-dev -e MYSQL_ROOT_PASSWORD=root -d mysql:latest

# Starting the container next time
docker container start mysql-dev

# Get the container ID
docker ps

# Get your MySQL HOST & MySQL PORT
docker inspect YOUR_CONTAINER_ID

# Connect to the bash into the running MySQL container
docker exec -t -i mysql-dev /bin/bash

# Run MySQL client from bash MySQL container
mysql -uroot -proot

# Create database
CREATE DATABASE restaurant_api;
```

## API Endpoints

### Restaurant Routes

`GET /api/v1/restaurants/`  
`GET /api/v1/restaurants/:id`  
`POST /api/v1/restaurants/`  
`PATCH /api/v1/restaurants/:id`  
`DELETE /api/v1/restaurants/:id`

### Review Routes

`GET /api/v1/reviews/`  
`GET /api/v1/reviews/restaurant/:id`  
`GET /api/v1/reviews/:id`  
`POST /api/v1/reviews/`  
`PATCH /api/v1/reviews/:id`  
`DELETE /api/v1/reviews/:id`

## Things To Consider

Protecting certain routes  
Custom CORS setup  
Tweaking the already-set rate limiting

## Sample Requests

You can find sample requests in the api.http file. Using this file requires the REST Client extension for VS Code

## App Info

### Author

Michal Kaštan

### Version

1.0.0

### License

This project is licensed under the MIT License
