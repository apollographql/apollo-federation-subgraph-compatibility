FROM lukemathwalker/cargo-chef:latest-rust-1.63 AS chef
WORKDIR app

FROM chef as planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release

FROM gcr.io/distroless/cc-debian10
COPY --from=builder /app/target/release/federation-async-graphql-compatibility /usr/local/bin/federation-async-graphql-compatibility
CMD ["federation-async-graphql-compatibility"]