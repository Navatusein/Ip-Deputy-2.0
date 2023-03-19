build:
	docker build -t navatusein/ip-deputy-bot:$(v) -t navatusein/ip-deputy-bot:latest .
push:
	docker push navatusein/ip-deputy-bot -a
run:
	docker run --rm --env-file .env --name ip-deputy-bot navatusein/ip-deputy-bot