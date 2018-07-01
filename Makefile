.PHONY: lint start install build

SRC = $(wildcard client/*.js)
LIB = $(SRC:client/%.js=public/lib/%.js)

all: lint install build start

lint:
	./node_modules/.bin/eslint client/ src/*.js data/*.js --fix

start: 
	node server.js start

setup: 
	npm install
	npm rebuild node-sass --force
	make webpack

watch:
	./node_modules/.bin/webpack --watch

webpack:
	./node_modules/.bin/webpack

build: webpack
