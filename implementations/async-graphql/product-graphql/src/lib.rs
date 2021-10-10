use async_graphql::{EmptyMutation, EmptySubscription, Schema};
use async_graphql::extensions::ApolloTracing;
use graphql::Query;

use crate::{graphql::ProductSchema, products::ProductRepository};

pub mod graphql;
pub mod products;

pub fn create_schema() -> Schema<Query, EmptyMutation, EmptySubscription> {
	let schema = ProductSchema::build(Query, EmptyMutation, EmptySubscription)
			.data(ProductRepository::default())
			.extension(ApolloTracing)
			.finish();

	schema
}