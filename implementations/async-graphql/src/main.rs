use actix_web::{guard, web, web::Data, App, HttpServer};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use std::net::Ipv4Addr;

mod graphql;
use crate::graphql::{create_schema, ProductSchema};

async fn index(schema: web::Data<ProductSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(create_schema().clone()))
            .service(web::resource("/").guard(guard::Post()).to(index))
        })
        .bind((Ipv4Addr::UNSPECIFIED, 4001))?
        .run()
        .await
}
