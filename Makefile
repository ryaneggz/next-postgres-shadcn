SANDBOX ?= ubuntu
TAG ?= latest
REGISTRY = ghcr.io/ruska-ai
IMAGE = $(REGISTRY)/sandbox:$(SANDBOX)-$(TAG)

.PHONY: build push all

build:
	docker build -t $(IMAGE) $(SANDBOX)/

push:
	docker push $(IMAGE)

all: build push
