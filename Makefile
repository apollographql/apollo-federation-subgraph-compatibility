.PHONY: default
default: test

ubuntu-latest=ubuntu-latest=catthehacker/ubuntu:act-latest

.PHONY: test
test:
	sed 's/RUN//g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run

.PHONY: test-absinthe-federation
test-absinthe-federation:
	sed 's/RUN/absinthe-federation/g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run

.PHONY: test-apollo-server
test-apollo-server:
	sed 's/RUN/apollo-server/g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run

.PHONY: test-appsync
test-appsync:
	sed 's/RUN/appsync/g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run

.PHONY: test-ariadne
test-ariadne:
	sed 's/RUN/ariadne/g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run

.PHONY: test-async-graphql
test-async-graphql:
	sed 's/RUN/async-graphql/g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run

.PHONY: test-caliban
test-caliban:
	sed 's/RUN/caliban/g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run

.PHONY: test-dgs
test-dgs:
	sed 's/RUN/dgs/g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run

.PHONY: test-federation-jvm
test-federation-jvm:
	sed 's/RUN/federation-jvm/g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run

.PHONY: test-graphene
test-graphene:
	sed 's/RUN/graphene/g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run

.PHONY: test-graphql-kotlin
test-graphql-kotlin:
	sed 's/RUN/graphql-kotlin/g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run

.PHONY: test-php
test-php:
	sed 's/RUN/php/g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run

.PHONY: test-ruby
test-ruby:
	sed 's/RUN/ruby/g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run

.PHONY: test-stawberry-graphql
test-stawberry-graphql:
	sed 's/RUN/stawberry-graphql/g' act-test.event > act-test.run
	act -P $(ubuntu-latest) -W .github/workflows/local.yaml --eventpath act-test.run --detect-event; rm act-test.run
