FROM rust:1.63 as build

WORKDIR /usr/src/federation-async-graphql-compatibility

RUN USER=root cargo init
COPY Cargo.toml Cargo.lock ./
RUN cargo build --release

COPY src ./src

RUN cargo install --path .

FROM gcr.io/distroless/cc-debian10

COPY --from=build /usr/local/cargo/bin/federation-async-graphql-compatibility /usr/local/bin/federation-async-graphql-compatibility

CMD ["federation-async-graphql-compatibility"]