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
    pub async fn product<'a>(&self, ctx: &Context<'a>, id: ID) -> Option<Product<'a>> {
      let repo = ctx.data::<ProductRepository>().unwrap();
      repo.get(id)
    }

    #[graphql(entity)]
    async fn find_product_by_id<'a>(&self, ctx: &Context<'a>, id: ID) -> Option<Product<'a>> {
      let repo = ctx.data::<ProductRepository>().unwrap();
      repo.get(id)
    }

    #[graphql(entity)]
    async fn find_product_by_sku_and_package<'a>(&self, ctx: &Context<'a>, sku: String, package: String) -> Option<Product<'a>> {
      let repo = ctx.data::<ProductRepository>().unwrap();
      repo.get_with_sku_and_package(sku, package)
    }

    #[graphql(entity)]
    async fn find_product_by_sku_and_variation_id<'a>(&self, ctx: &Context<'a>, sku: String, variation: VariationIdKey) -> Option<Product<'a>> {
      let repo = ctx.data::<ProductRepository>().unwrap();
      repo.get_with_sku_and_variation_id(sku, variation.id)
    }

}

#[derive(Clone)]
pub struct Product<'a> {
    pub id: ID,
    pub sku: Option<&'a str>,
    pub package: Option<&'a str>,
    pub variation: Option<ProductVariation>,
}

#[Object]
impl Product<'_> {
    pub async fn id(&self) -> &ID {
      &self.id
    }
    pub async fn sku(&self) -> &Option<&str> {
      &self.sku
    }
    pub async fn package(&self) -> &Option<&str> {
      &self.package
    }
    pub async fn variation(&self) -> &Option<ProductVariation> {
      &self.variation
    }
    pub async fn dimensions(&self) -> Option<ProductDimension<'_>> {
      Some(ProductDimension { size: Some("1"), weight: Some(1f32) })
    }

    #[graphql(provides="totalProductsCreated")]
    pub async fn created_by(&self) -> Option<User> {
      Some(User { email: "support@apollographql.com".into(), total_products_created: Some(1337) })
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
