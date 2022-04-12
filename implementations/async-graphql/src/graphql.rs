use async_graphql::extensions::ApolloTracing;
use async_graphql::*;

pub(crate) type ProductSchema = Schema<Query, EmptyMutation, EmptySubscription>;

/// Input type for resolving `variation { id }` for Product key fields
#[derive(InputObject)]
struct VariationIdKey {
    id: ID,
}

/// GraphQL Query type
pub(crate) struct Query;

#[Object(extends)]
impl Query {
    /// extend type Query {
    ///   product(id: ID!): Product
    /// }
    pub(crate) async fn product<'a>(&self, ctx: &'a Context<'_>, id: ID) -> Option<&'a Product> {
        let products = ctx.data_unchecked::<Vec<Product>>();
        products.iter().find(|product| product.id == id)
    }

    /// Resolve product by `id` key field
    /// ref: `type Product @key(fields: "id")`
    #[graphql(entity)]
    async fn find_product_by_id<'a>(&self, ctx: &'a Context<'_>, id: ID) -> Option<&'a Product> {
        let products = ctx.data_unchecked::<Vec<Product>>();
        products.iter().find(|product| product.id == id)
    }

    /// Resolve product by `sku package` key fields
    /// ref: `type Product @key(fields: "sku package")`
    #[graphql(entity)]
    async fn find_product_by_sku_and_package<'a>(
        &self,
        ctx: &'a Context<'_>,
        sku: String,
        package: String,
    ) -> Option<&'a Product> {
        let products = ctx.data_unchecked::<Vec<Product>>();
        products.iter().find(|product| {
            product.sku.as_ref() == Some(&sku) && product.package.as_ref() == Some(&package)
        })
    }

    /// Resolve product by `sku variation { id }` key fields
    /// ref: `type Product @key(fields: "sku variation { id }")`
    #[graphql(entity)]
    async fn find_product_by_sku_and_variation_id<'a>(
        &self,
        ctx: &'a Context<'_>,
        sku: String,
        variation: VariationIdKey,
    ) -> Option<&'a Product> {
        let products = ctx.data_unchecked::<Vec<Product>>();
        let variation_id = variation.id;
        products.iter().find(|p| {
            p.sku.as_ref() == Some(&sku)
                && p.variation.as_ref().map(|v| v.id == variation_id) == Some(true)
        })
    }
}

#[derive(Clone)]
pub struct Product {
    pub id: ID,
    pub sku: Option<String>,
    pub package: Option<String>,
    pub variation: Option<ProductVariation>,
}

#[Object]
impl Product {
    pub async fn id(&self) -> &ID {
        &self.id
    }
    pub async fn sku(&self) -> &Option<String> {
        &self.sku
    }
    pub async fn package(&self) -> &Option<String> {
        &self.package
    }
    pub async fn variation(&self) -> &Option<ProductVariation> {
        &self.variation
    }
    pub async fn dimensions(&self) -> Option<ProductDimension<'_>> {
        Some(ProductDimension {
            size: Some("small"),
            weight: Some(1f32),
        })
    }

    /// `createdBy: User @provides(fields: "totalProductsCreated")` property on `Product` type
    #[graphql(provides = "totalProductsCreated")]
    pub async fn created_by(&self) -> Option<User> {
        Some(User {
            email: "support@apollographql.com".into(),
            total_products_created: Some(1337),
        })
    }
}

#[derive(SimpleObject, Clone)]
pub struct ProductVariation {
    pub id: ID,
}

#[derive(SimpleObject)]
pub struct ProductDimension<'a> {
    size: Option<&'a str>,
    weight: Option<f32>,
}

/// extend type User @key(fields: "email") {
///   email: ID! @external
///   totalProductsCreated: Int @external
/// }
pub struct User {
    email: ID,
    total_products_created: Option<i32>,
}

#[Object(extends)]
impl User {
    #[graphql(external)]
    pub async fn email(&self) -> &ID {
        &self.email
    }

    #[graphql(external)]
    pub async fn total_products_created(&self) -> Option<i32> {
        self.total_products_created
    }
}

/// Create the GraphQL schema and setup query context data sources
pub(crate) fn create_schema() -> ProductSchema {
    let products = vec![
        Product {
            id: "apollo-federation".into(),
            sku: Some("federation".to_string()),
            package: Some("@apollo/federation".to_string()),
            variation: Some(ProductVariation { id: "OSS".into() }),
        },
        Product {
            id: "apollo-studio".into(),
            sku: Some("sku".to_string()),
            package: Some("".to_string()),
            variation: Some(ProductVariation {
                id: "platform".into(),
            }),
        },
    ];

    ProductSchema::build(Query, EmptyMutation, EmptySubscription)
        .data(products)
        .extension(ApolloTracing)
        .finish()
}
