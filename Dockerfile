# docker build -t sonarqube .
# docker run --rm -it sonarqube
# 
FROM maven:3.2.5-jdk-8

# Install node, firefox and xvfb
RUN echo "deb http://downloads.sourceforge.net/project/ubuntuzilla/mozilla/apt all main" >> /etc/apt/sources.list
RUN apt-key adv --recv-keys --keyserver keyserver.ubuntu.com C1289A29

RUN apt-get update && apt-get install -y \
	firefox \
	nodejs \
	npm \
	xvfb \
	vim

RUN ln -s /usr/bin/nodejs /usr/bin/node

# Install Xvfb init script
ADD scripts/xvfb_init /etc/init.d/xvfb
RUN chmod a+x /etc/init.d/xvfb

# Copy sources
RUN mkdir -p $HOME/sonarqube
WORKDIR /root/sonarqube
ADD . ./

ENV JOB WEB
CMD ["./travis.sh"]
#CMD ["bash"]
