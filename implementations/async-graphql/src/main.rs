use actix_web::{post, web, App, HttpServer};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use std::net::Ipv4Addr;

mod graphql;
use crate::graphql::{create_schema, ProductSchema};

#[post("/")]
async fn index(schema: web::Data<ProductSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().app_data(create_schema()).service(index))
        .bind((Ipv4Addr::UNSPECIFIED, 4001))?
        .run()
        .await
}
