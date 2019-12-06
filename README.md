## STOCKX CODING CHALLENGE

### Instruction:
Please pull down from github. If you wish to run this app locally without using Docker, please make sure you finished the following before you go to next step:
- postgresdb installed on your machine.
- create a role for PostgresDB with a username 'postgres', with password: 'postgres"
- create a db named 'stockx',
- if you're using docker, please go to file 'swagger/openai.json', on line 80, please change "http://localhost:4000/fakeStream" to "<your Docker Ip address>:4000/fakeStream".

Schema and table are created automatically using 'npm run createdb' script (will be done later in the process). Initial admin user data is also created with this script.

To run the app, please cd into stockx folder then use the following commands:
```
#install dependencies:
npm install

#create database if not exists:
npm run createdb

#create some fake data before running automated test.
#NOTE: you have to use this command before start up the app or else the db wouldn't have any data in it:
npm run test

#start app:
npm run start

#use swagger:
go to <local or Docker ip>:4000/api-docs
```
## The easiest way to have the app running is to spin up the app and db together using Docker_compose.
#### Before building your Docker Image, please check your VM's ip address and change the following files in root folder:
#### - docker-compose.yml
####  => line 11 to your VM's ip address
####  => line 12 to your VM's ip address. Remember to prepend "http://" for this one

### Please run the following script:
```
  docker-compose up
  docker exec -ti stockx npm run createdb
  docker exec -ti stockx npm run test
```

#### If you wish to build your own Docker Image:

```
# build:
docker build -t hluu5/stockx .

# To find your image:
docker images

# Run docker container manually:
docker run -p 4000:4000 -d --name stockx hluu5/stockx -e PASSWORD=postgres -e POSTGRES_HOST=<your ip address> -e HOST=<your ip address> -e SERVER_USER=admin -e SERVER_PASSWORD=admin

# create a database and table if not exist
docker exec -ti stockx npm run createdb

# Auto seeding fake data and run automated test:
docker exec -ti stockx npm run test

# Seeding fake data. Caution: this will cause the app to fail one automated test (this test requires no data in db):
docker exec -ti stockx npm run seed
```

Now you can go to your ip address at port 4000 to access your docker container. On older windows version, you might want to try going to ip address that was assigned to your VM

### To Use Swagger:
```
go to <docker ip address>:4000/api-docs
```

## To insert data manually, you can use POSTMAN or axios to make a post request to '/createNewEntry':
### Format:
#### There are two ways to retrieve data from server API:
1. Passing params in url:
  format: http://<your VM or localhost ip address>:4000/trueToSizeCalculation/:shoesname
```
  http://192.168.99.100:4000/trueToSizeCalculation/shoses3wqsad4r
```

2. Passing params using a fetch module such as axios:
  ```
    axios({
      url: 'http://localhost:4000/trueToSizeCalculation',
      method: 'GET',
      params: {
        shoesname: 'shoses'
      }
    })
    .then(data=> console.log(data.data))
    .catch(err=>console.log(err))
  ```

## Summary Of All Aspects Of The App:
### Environment Variables:
The app is prodivded with a .env file to act as center of control for all environment variables. For Docker users, env variables are controlled by passing env variables in the docker-compose.yml file or by providing env variables at run time scripts.

### Enviroment Behavior Control: Docker
For making sure the environment of the app is consistent when shipped out, it is provided with Dockerfile and docker-compose.yml files for building docker images. Docker Compose is the preferred way to have the app up and running since it combines all services (PostgresDB and the App itself) to one place.

### API Documentation and Maintainability: Swagger, Comments, README.MD
- This comprehensive README file is designed to guide you to most aspects of the app. But Swagger is built on top of this app for ease of navigating. It uses a schema in the "openapi.json" file.

- Comments are provided as needed for clarification. I tried to balance out between not having too much comments and enough for other engineers can pick up and maintain the project.

### Validation: express-validator:
I use expess-validator to check types and required fields of all the queries that are needed to send to an API.

Postgres Schema also benefits from this since columns type are predefined, too.

### Testing: Jest + Supertest:
I assume data that are being retrieved from a crowd-sourced API are big in size, therefore I used stream and pipe to read and write data. A total of 6 tests both unit and integration tests are shipped with the app. Testing includes:
- check authentication: only admin user can insert data into db.
- check availability of data. Return data that are properly inserted.
- no duplication is allowed in db.
- check ability to retrieve data from a crowd-source API and saved it to db.

### Logging:
#### Logs are not being shown in console because we don't want users to see them in production-ready app
#### Instead, they are saved inside 'logs' folder: 'appLog.log' and 'appError.log'. This will reduce run time and improve security:
```
## To access log files inside Docker Container, you can copy them to your host local directory using commands:

docker cp <container-id>:/path/to/file ./local-dir

## Example: copy appLog.log file to host's "logs" folder:
docker cp 1df7c6bfeb20:app/logs/appLog.log ./logs
```
### Monitoring:
I'm using New Relic APM to monitor my app. Its key metrics are being exported to New Relic APM cloud and can be accessed from there.

New Relic also has Alert feature that will alert you if your app falls below certain thresholds. For example, it set my app to have error rate of above 2%. It will automatically notify me through email or slack.

Apps and Postgres are also being kept alive always with Docker's restart policy.
If we don't use Docker to manage our app, we can use PM2 to keep our app alive and restart automatically.


