#########################
### build environment ###
#########################

# base image
FROM node:9 as builder

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY . /usr/src/app

# install and cache app dependencies
RUN npm install


# generate build
RUN npm run build

##################
### production ###
##################

# base image
FROM nginx:1.13.9-alpine as webserver

RUN rm -rf /usr/share/nginx/html/*
COPY tools/nginx.conf /etc/nginx/nginx.conf

# copy artifact build from the 'build environment'
COPY --from=builder /usr/src/app/dist/apps/demoapp /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
