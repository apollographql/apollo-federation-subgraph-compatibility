use actix_web::{HttpResponse, web};
use async_graphql::{EmptyMutation, EmptySubscription, Schema, http::{GraphQLPlaygroundConfig, playground_source}};
use async_graphql_actix_web::{Request, Response};
use crate::graphql::{ProductSchema, Query};

pub fn configure_service(cfg: &mut web::ServiceConfig) {
    cfg
        .service(web::resource("/")
            .route(web::post().to(index))
            .route(web::get().to(index_playground))
        );
}

async fn index(schema: web::Data<ProductSchema>, req: Request) -> Response {
	let query = req.into_inner();
	schema.execute(query).await.into()
}

async fn index_playground() -> HttpResponse {
	HttpResponse::Ok()
			.content_type("text/html; charset=utf-8")
			.body(playground_source(
					GraphQLPlaygroundConfig::new("/").subscription_endpoint("/"),
			))
}

pub fn create_schema() -> Schema<Query, EmptyMutation, EmptySubscription> {
	let schema = ProductSchema::build(Query, EmptyMutation, EmptySubscription)
        .finish();

	println!("{}", schema.federation_sdl());

	schema
}
