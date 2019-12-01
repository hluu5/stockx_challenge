## STOCKX CODING CHALLENGE

### Instruction:
Please pull down from github
To run the app, please use the following commands:
```
npm install
npm run start
```

#### To build your own Docker Image:
Please run the following command:
```
docker build -t <your username>/<app name> .

>find your image

docker images

docker run -p 4000:4000 -d <your username>/<app name>
```
Now you can go to your ip address at port 4000 to access your docker container. On older windows version, you might want to try going to ip address that was assigned to your VM