FROM rust:1.56 as build

WORKDIR /usr/src/federation-async-graphql-compatibility

COPY . .

RUN cargo install --path .

FROM gcr.io/distroless/cc-debian10

COPY --from=build /usr/local/cargo/bin/federation-async-graphql-compatibility /usr/local/bin/federation-async-graphql-compatibility

CMD ["federation-async-graphql-compatibility"]