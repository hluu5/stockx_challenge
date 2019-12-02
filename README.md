## STOCKX CODING CHALLENGE

### Instruction:
Please pull down from github. If you are running this locally without using Docker, please make sure you finished the following before you go to next step:
- postgresdb installed on you machine.
- create a username 'postgres', with password: 'postgres"
- create a db name 'stockx'
- make sure to change file /postgresDB/index.js line 9 and 13 accordingly
Schema and table are created automatically using 'npm run createdb' (will be done later in the process) script

To run the app, please cd into stockx folder then use the following commands:
```
#install dependencies:
npm install

#create database if not exists:
npm run createdb

#start app:
npm run start
```

#### To build your own Docker Image:
# Before building your Docker Image, please check your VM's ip address and change the following files:
# - docker-compose.yml     => line 11 to your VM's ip address
After you finished, please run the following command:
```
docker build -t <your username>/<app name> .

#To find your image:

docker images

docker run -p 4000:4000 -d --name stockx <your username>/<app name>

#create a database and table if not exist
docker exec -ti stockx npm run createdb
```

Now you can go to your ip address at port 4000 to access your docker container. On older windows version, you might want to try going to ip address that was assigned to your VM

## PostgresDB is intiated using docker compose. If you want to spin up a standalone postgres container, you can run the following script:
```
  docker run -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=stockx -e POSTGRES_USER=postgres postgres
```

#### The easiest way to have the app running is to spin up the app and db together using Docker_compose. Please run the following script:
```
  docker-compose up
  docker exec -ti stockx npm run createdb
```

## Please create some fake data before testing out the url:
```
## Using docker container:
  docker exec -ti stockx npm run test

## Locally:
  npm run test
```

## There are two ways to retrieve data from server API:
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


