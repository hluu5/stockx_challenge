## STOCKX CODING CHALLENGE

### Instruction:
Please pull down from github. If you are running this locally without using Docker, please make sure you finished the following before you go to next step:
- postgresdb installed on you machine.
- create a role for PostgresDB with a username 'postgres', with password: 'postgres"
- create a db named 'stockx'
- make sure to change file /postgresDB/index.js line 8 and 14 accordingly

Schema and table are created automatically using 'npm run createdb' script (will be done later in the process). Initial user data is also created with this script

To run the app, please cd into stockx folder then use the following commands:
```
#install dependencies:
npm install

#create database if not exists:
npm run createdb

#create some fake data:
npm run seed

#start app:
npm run start

#run automated test:
npm run test
```
#### The easiest way to have the app running is to spin up the app and db together using Docker_compose. # Before building your Docker Image, please check your VM's ip address and change the following files:
# - docker-compose.yml     => line 11 and 12 to your VM's ip address

# Please run the following script:
```
  docker-compose up
  docker exec -ti stockx npm run createdb
  docker exec -ti stockx npm run seed
```

#### To build your own Docker Image:

After you finished, please run the following command:
```
docker build -t hluu5/stockx .

# To find your image:

docker images

# Run docker container manually:
docker run -p 4000:4000 -d --name stockx hluu5/stockx -e PASSWORD=postgres -e POSTGRES_HOST=<your ip address> -e HOST=<your ip address> -e SERVER_USER=admin -e SERVER_PASSWORD=admin

#create a database and table if not exist
docker exec -ti stockx npm run createdb

#seed fake data:
docker exec -ti stockx npm run seed

#Run automated test:
docker exec -ti stockx npm run test
```

Now you can go to your ip address at port 4000 to access your docker container. On older windows version, you might want to try going to ip address that was assigned to your VM

## PostgresDB is intiated using docker compose. If you want to spin up a standalone postgres container, you can run the following script:
```
  docker run -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=stockx -e POSTGRES_USER=postgres postgres
```



## Please create some fake data before testing out the url. Inside the test file, dummy data is created and destroyed for you:
```
## Using docker container:
  docker exec -ti stockx npm run createdb
  docker exec -ti stockx npm run seed
## Locally:
  npm run createdb
  npm run seed
```

## To insert data manually, you can use POSTMAN or axios to make a post request to '/createNewEntry':
. Format:

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
## Logs are not being shown in console because we don't want user to see them in production-ready app
## Instead, they are saved inside appLog.log and appError.log. This will reduce run time and improve security
```
## To access log files inside Docker Container, you can copy them to your host local directory using commands:

docker cp <container-id>:/path/to/file ./local-dir

## Example: copy appLog.log file to host's "tests" folder:
docker cp 1df7c6bfeb20:app/appLog.log ./tests
```
### Monitoring:
I'm using New Relic APM to monitor my app. Its key metrics are being exported to New Relic APM cloud and can be accessed from there.


