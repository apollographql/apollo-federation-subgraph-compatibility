.PHONY: setup
setup:
	npm install

.PHONY: test
test:
	npm run compatibility:test -- docker --compose implementations/$(subgraph)/docker-compose.yaml --schema implementations/_template_library_/products.graphql

.PHONY: test-all
test-all:
	./test_all.sh
