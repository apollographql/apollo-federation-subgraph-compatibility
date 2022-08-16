use async_graphql::{ComplexObject, Context, InputObject, Object, SimpleObject, ID};

use crate::schema::user::User;
use crate::schema::ProductResearch;

#[derive(SimpleObject, Clone, Debug)]
#[graphql(complex)]
pub struct Product {
    pub id: ID,
    pub sku: Option<String>,
    pub package: Option<String>,
    pub variation: Option<ProductVariation>,
    pub notes: Option<String>, // @tag(name: "internal")
    pub research: Vec<ProductResearch>,
}

#[ComplexObject]
impl Product {
    pub async fn dimensions(&self) -> Option<ProductDimension<'_>> {
        Some(ProductDimension {
            size: Some("small"),
            weight: Some(1f32),
            unit: Some("kg"),
        })
    }

    #[graphql(provides = "totalProductsCreated")]
    pub async fn created_by(&self) -> Option<User> {
        Some(User::default())
    }
}

#[derive(SimpleObject, Debug)]
pub struct ProductDimension<'a> {
    // @shareable
    size: Option<&'a str>,
    weight: Option<f32>,
    unit: Option<&'a str>, // @inaccessible
}

#[derive(SimpleObject, Clone, Debug)]
pub struct ProductVariation {
    pub id: ID,
}

/// Input type for resolving `variation { id }` for Product key fields
#[derive(InputObject)]
struct VariationIdKey {
    id: ID,
}

#[derive(Default)]
pub struct ProductsQuery;

#[Object]
impl ProductsQuery {
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
			&& p.variation.as_ref().and_then(|v| Some(&v.id)) == Some(&variation_id)
		})
    }
}
