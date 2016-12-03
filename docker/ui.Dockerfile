FROM ubuntu:16.04

MAINTAINER Jim Watkins "jwatkins@thenewoffice.com"

# Install everything
RUN apt-get update && apt-get install -y \
    curl \
    language-pack-en

# Add user and mount points
RUN useradd -m -G users -s /bin/bash meteor && \
    mkdir /vertify-ui

USER meteor

# Download and install Meteor.js
RUN curl https://install.meteor.com/ | sh
ENV PATH /home/meteor/.meteor:$PATH

# Add source code to container
ADD . /vertify-ui
WORKDIR /vertify-ui

USER root
RUN chown -R meteor /vertify-ui
USER meteor

# Reset meteor
RUN meteor reset && meteor npm install

# Expose UI ports
EXPOSE 3000

# Setup volumes
VOLUME ["/vertify-ui"]

ENTRYPOINT ["meteor"]
#, "--settings", "settings.json"]
# to user meteor settings file, add --settings settings.json
