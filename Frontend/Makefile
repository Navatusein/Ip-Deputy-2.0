build:
	docker build -t navatusein/ip-deputy-frontend:$(v) -t navatusein/ip-deputy-frontend:latest .
push:
	docker push navatusein/ip-deputy-frontend -a
run:
	docker run -p 8080:8080 --rm --env-file settings/.env --name ip-deputy-frontend navatusein/ip-deputy-frontend
publish:
	make build v=$(v)
	make push