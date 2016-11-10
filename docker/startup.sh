#!/bin/bash

set -x
mongod --fork --noprealloc --smallfiles --config /etc/mongod.conf
sleep 1
mongo --eval 'rs.initiate({_id: "dockerset", members: [{_id: 0, host: "localhost:27017"}]})'
tailf /dev/null
