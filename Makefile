TAG=$(shell git rev-parse --short HEAD~1)
PROFILE=Local
include .env

lint:
	npm run lint

tests:
	npm run tests

build: lint tests
	npm run build

build/docker:
	docker image build --tag nodejs-express-starter:latest .

run/docker-compose:
	docker-compose up --build

run/docker: build/docker
	docker run -p 8000:8000 --env-file .env -it nodejs-express-starter:latest

run: build
	npm run dev
