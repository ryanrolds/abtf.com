.PHONY: lint start install

lint:
	./node_modules/.bin/eslint lib/*.js data/*.js --fix

start:
	node server.js start

install:
	npm isntall
