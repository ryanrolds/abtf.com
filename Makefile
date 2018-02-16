.PHONY: lint start install build

SRC = $(wildcard client/*.js)
LIB = $(SRC:client/%.js=public/lib/%.js)

all: lint install build start

lint:
	./node_modules/.bin/eslint client/ src/*.js data/*.js --fix

start: 
	node server.js start

install: 
	npm isntall

webpack:
	./node_modules/.bin/webpack

build: webpack
