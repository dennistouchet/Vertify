FROM mongo

ADD ./docker/mongod.conf /etc/mongod.conf
ADD ./docker/startup.sh /startup.sh

CMD ["bash", "/startup.sh"]