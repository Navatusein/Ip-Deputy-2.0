build:
	docker rmi navatusein/ip-deputy-backend
	docker build -t navatusein/ip-deputy-backend:$(v) -t navatusein/ip-deputy-backend:latest .
push:
	docker push navatusein/ip-deputy-backend -a
run:
	docker run --rm --name ip-deputy-backend navatusein/ip-deputy-backend
publish:
	make build v=$(v)
	make push