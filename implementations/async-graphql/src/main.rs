use actix_web::{guard, http::header, web, web::Data, App, HttpServer, Responder};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use std::net::Ipv4Addr;

mod schema;
use crate::schema::{create_schema, ProductSchema};

async fn index(schema: web::Data<ProductSchema>, req: GraphQLRequest) -> impl Responder {
    // async-graphql v7 always responds with `application/graphql-response+json`
    GraphQLResponse::from(schema.execute(req.into_inner()).await)
        .customize()
        .insert_header((header::CONTENT_TYPE, "application/json"))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(create_schema()))
            .service(web::resource("/").guard(guard::Post()).to(index))
    })
    .bind((Ipv4Addr::UNSPECIFIED, 4001))?
    .run()
    .await
}
