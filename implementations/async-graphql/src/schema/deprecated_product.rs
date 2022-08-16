use crate::schema::user::User;
use async_graphql::{Context, Object, SimpleObject};

#[derive(SimpleObject)]
pub struct DeprecatedProduct<'a> {
    sku: &'a str,
    package: &'a str,
    reason: Option<&'a str>,
    created_by: Option<User>,
}

const DEPRECATED_PRODUCT: DeprecatedProduct = DeprecatedProduct {
    sku: "apollo-federation-v1",
    package: "@apollo/federation-v1",
    reason: Some("Migrate to Federation V2"),
    created_by: None,
};

#[derive(Default)]
pub struct DeprecatedProductQuery;

#[Object]
impl DeprecatedProductQuery {
    #[graphql(deprecation = "Use product query instead")]
    pub(crate) async fn deprecated_product<'a>(
        &self,
        _ctx: &'a Context<'_>,
        sku: String,
        package: String,
    ) -> Option<&'a DeprecatedProduct<'a>> {
        if sku == DEPRECATED_PRODUCT.sku && package == DEPRECATED_PRODUCT.package {
            return Some(&DEPRECATED_PRODUCT);
        }

        None
    }

    #[graphql(entity)]
    async fn find_deprecated_product_by_sku_and_package<'a>(
        &self,
        _ctx: &'a Context<'_>,
        sku: String,
        package: String,
    ) -> Option<&'a DeprecatedProduct<'a>> {
        if sku == DEPRECATED_PRODUCT.sku && package == DEPRECATED_PRODUCT.package {
            return Some(&DEPRECATED_PRODUCT);
        }

        None
    }
}
