use std::net::Ipv4Addr;
use actix_web::{App, HttpServer, middleware::Logger};

use crate::endpoints::create_schema;

mod endpoints;
mod graphql;
mod products;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .data(create_schema())
            .configure(endpoints::configure_service)
    })
    .bind((Ipv4Addr::UNSPECIFIED, 4001))?
    .run()
    .await
}
