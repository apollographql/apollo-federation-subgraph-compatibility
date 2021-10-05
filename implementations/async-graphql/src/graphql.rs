use async_graphql::*;
use crate::products::ProductRepository;

pub type ProductSchema = Schema<Query, EmptyMutation, EmptySubscription>;

#[derive(InputObject)]
struct VariationIdKey {
  id: ID
}

pub struct Query;

#[Object(extends)]
impl Query {
    pub async fn product(&self, ctx: &Context<'_>, id: ID) -> Option<Product> {
      let repo = ctx.data::<ProductRepository>().unwrap();
      repo.get(id)
    }

    #[graphql(entity)]
    async fn find_product_by_id(&self, ctx: &Context<'_>, id: ID) -> Option<Product> {
      let repo = ctx.data::<ProductRepository>().unwrap();
      repo.get(id)
    }

    #[graphql(entity)]
    async fn find_product_by_sku_and_package(&self, ctx: &Context<'_>, sku: String, package: String) -> Option<Product> {
      let repo = ctx.data::<ProductRepository>().unwrap();
      repo.get_with_sku_and_package(sku, package)
    }

    #[graphql(entity)]
    async fn find_product_by_sku_and_variation_id(&self, ctx: &Context<'_>, sku: String, variation: VariationIdKey) -> Option<Product> {
      let repo = ctx.data::<ProductRepository>().unwrap();
      repo.get_with_sku_and_variation_id(sku, variation.id)
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
    pub async fn dimensions(&self) -> Option<ProductDimension> {
      Some(ProductDimension { size: Some("1".to_string()), weight: Some(1f32) })
    }

    #[graphql(provides="totalProductsCreated")]
    pub async fn created_by(&self) -> Option<User> {
      Some(User { email: "supper@apollographql.com".into(), total_products_created: Some(1337) })
    }
}

#[derive(SimpleObject, Clone)]
pub struct ProductVariation {
	pub id: ID,
}

#[derive(SimpleObject)]
pub struct ProductDimension {
	size: Option<String>,
	weight: Option<f32>,
}


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
