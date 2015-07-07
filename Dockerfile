# docker build -t sonarqube .
# docker run --rm -it sonarqube
#
FROM maven:3.2.5-jdk-8

# Install node and xvfb
RUN echo "deb http://downloads.sourceforge.net/project/ubuntuzilla/mozilla/apt all main" >> /etc/apt/sources.list
RUN apt-key adv --recv-keys --keyserver keyserver.ubuntu.com C1289A29

RUN apt-get update && apt-get install -y \
	nodejs \
	npm \
	xvfb \
	vim

RUN ln -s /usr/bin/nodejs /usr/bin/node

# Install firefox 31
RUN (curl -SL http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/31.0/linux-x86_64/en-US/firefox-31.0.tar.bz2 | tar xj -C /opt) \
	&& ln -sf /opt/firefox/firefox /usr/bin/firefox

# Install firefox 39
# RUN (curl -SL http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/39.0/linux-x86_64/en-US/firefox-39.0.tar.bz2 | tar xj -C /opt) \
# 	&& ln -sf /opt/firefox/firefox /usr/bin/firefox

# Copy sources
RUN mkdir -p $HOME/sonarqube
WORKDIR /root/sonarqube
ADD . ./

ENV JOB WEB
CMD ["./travis.sh"]
#CMD ["bash"]
