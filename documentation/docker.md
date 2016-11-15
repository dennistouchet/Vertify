## DOCKER help

## install docker engine

    install docker engine

## install docker compose

    install docker -compose

### run commands with sudo

    sudo -s

    exit with ctrl+d

##Add yourself to docker group to avoid needing sudo for every command

    sudo groupadd docker

    sudo gpasswd -a username docker

    sudo service docker restart

## to view containers

    docker ps -a

## get docker id && ip

    ID=$(docker ps -l -q)

    docker inspect --format '{{ .NetworkSettings.IPAddress }}' $ID

## run docker instance

    go to directory: eg. /vertifyiu

    sudo docker-compose up --build

## run command inside docker

    docker ps

    docker exec -it 'dockerid' bash


## clear docker

### Linux bash
    docker rm $(docker ps -a -q)
    docker rmi -f $(docker images -q)
    docker volume rm $(docker volume ls -q)
    
### Windows batch 
    @FOR /f "tokens=*" %i IN ('docker ps -a -q') DO @docker rm -f %i
    @FOR /f "tokens=*" %i IN ('docker images -q') DO @docker rmi -f %i
    @FOR /f "tokens=*" %i IN ('docker volume ls -q') DO @docker volume rm %i
    
