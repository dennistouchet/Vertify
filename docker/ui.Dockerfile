FROM ubuntu:16.04

MAINTAINER Jim Watkins "jwatkins@thenewoffice.com"

# Install everything
RUN apt-get update && apt-get install -y \
    curl \
    language-pack-en

# Add user and mount points
RUN useradd -m -G users -s /bin/bash meteor && \
    mkdir /vertify-ui

# Add source code to container
ADD . /vertify-ui
VOLUME /vertify-ui
WORKDIR /vertify-ui

RUN chown -R meteor /vertify-ui

USER meteor

# Download and install Meteor.js
RUN curl https://install.meteor.com/ | sh
ENV PATH /home/meteor/.meteor:$PATH

# Reset meteor
RUN meteor reset && meteor npm install

# Expose UI ports
EXPOSE 3000


ENTRYPOINT ["meteor"]
