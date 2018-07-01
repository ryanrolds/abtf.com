FROM node:10
WORKDIR /app
ADD . /app
RUN make setup
EXPOSE 8080
ENV NAME abtfcom_frontend
CMD ["node", "server.js"]
