FROM rust:1.55

WORKDIR /usr/src/federation-async-graphql-compatibility
COPY . .

RUN cd federation-async-graphql-compatibility && cargo install --path .

CMD ["federation-async-graphql-compatibility"]

# FROM gcr.io/distroless/cc-debian10

# COPY --from=build /usr/local/cargo/bin/federation-async-graphql-compatibility /usr/local/bin/federation-async-graphql-compatibility

# CMD ["federation-async-graphql-compatibility"]