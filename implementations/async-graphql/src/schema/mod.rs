use async_graphql::{
    extensions::ApolloTracing, EmptyMutation, EmptySubscription, MergedObject, Schema,
};

mod deprecated_product;
mod product;
mod product_research;
mod user;
use self::deprecated_product::DeprecatedProductQuery;
use self::product::{Product, ProductVariation, ProductsQuery};
use self::product_research::{CaseStudy, ProductResearch, ProductResearchQuery};
use self::user::UserQuery;

pub(crate) type ProductSchema = Schema<Query, EmptyMutation, EmptySubscription>;

#[derive(MergedObject, Default)]
#[graphql(extends)]
pub(crate) struct Query(
    ProductsQuery,
    ProductResearchQuery,
    DeprecatedProductQuery,
    UserQuery,
);

/// Create the GraphQL schema and setup query context data sources
pub(crate) fn create_schema() -> ProductSchema {
    let product_research = vec![
        ProductResearch {
            study: CaseStudy {
                case_number: "1234".into(),
                description: Some("Federation Study".to_string()),
            },
            outcome: None,
        },
        ProductResearch {
            study: CaseStudy {
                case_number: "1235".into(),
                description: Some("Studio Study".to_string()),
            },
            outcome: None,
        },
    ];
    let products = vec![
        Product {
            id: "apollo-federation".into(),
            sku: Some("federation".to_string()),
            package: Some("@apollo/federation".to_string()),
            variation: Some(ProductVariation { id: "OSS".into() }),
            notes: None,
            research: vec![product_research[0].clone()],
        },
        Product {
            id: "apollo-studio".into(),
            sku: Some("studio".to_string()),
            package: Some("".to_string()),
            variation: Some(ProductVariation {
                id: "platform".into(),
            }),
            notes: None,
            research: vec![product_research[1].clone()],
        },
    ];

    ProductSchema::build(Query::default(), EmptyMutation, EmptySubscription)
        .data(products)
        .data(product_research)
        .extension(ApolloTracing)
        .finish()
}
