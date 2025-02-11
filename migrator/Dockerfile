FROM node:22
WORKDIR /migrator
ADD . /migrator
RUN npm install
ENV NAME abtfcom_migrator
CMD ["node", "migrator.js"]
