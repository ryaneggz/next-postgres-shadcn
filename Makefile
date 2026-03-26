SANDBOX_NAME ?= sandbox
TAG ?= latest
REGISTRY = ghcr.io/ruska-ai
IMAGE = $(REGISTRY)/sandbox/$(SANDBOX_NAME):$(TAG)

.PHONY: build run shell stop push all clean

build:
	docker build -t $(IMAGE) .

run:
	docker compose up -d

shell:
	docker compose exec sandbox bash

stop:
	docker compose down

push:
	docker push $(IMAGE)

all: build push

clean:
	docker compose down --rmi local
