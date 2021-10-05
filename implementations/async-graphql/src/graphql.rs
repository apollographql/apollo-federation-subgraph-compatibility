/*
type Product
  @key(fields: "id")
  @key(fields: "sku package")
  @key(fields: "sku variation { id }") {
  id: ID!
  sku: String
  package: String
  variation: ProductVariation
  dimensions: ProductDimension

  createdBy: User @provides(fields: "totalProductsCreated")
}

type ProductVariation {
  id: ID!
}

type ProductDimension {
  size: String
  weight: Float
}

extend type Query {
  product(id: ID!): Product
}

extend type User @key(fields: "email") {
  email: ID! @external
  totalProductsCreated: Int @external
}
*/
use async_graphql::*;

pub type ProductSchema = Schema<Query, EmptyMutation, EmptySubscription>;

#[derive(InputObject)]
struct ProductSkuPackageKey {
  sku: String,
  package: String,
}

#[derive(InputObject)]
struct VariationIdKey {
  id: ID
}

pub struct Query;

#[Object(extends)]
impl Query {
    pub async fn product(&self, id: ID) -> Option<Product> {
      let mut products = Vec::new();
      products.push(Product {
          id: "apollo-federation".into(),
          sku: Some("federation".to_string()),
          package: Some("@apollo/federation".to_string()),
          variation: Some(ProductVariation {
            id: "OSS".into()
          }),
        });
        products.push(Product {
          id: "apollo-federation".into(),
          sku: Some("federation".to_string()),
          package: Some("@apollo/federation".to_string()),
          variation: Some(ProductVariation {
            id: "OSS".into()
          }),
        });

      products.into_iter().find(|p| p.id == id)
    }

    #[graphql(entity)]
    async fn find_product_by_id(&self, id: ID) -> Option<Product> {
      let mut products = Vec::new();
      products.push(Product {
          id: "apollo-federation".into(),
          sku: Some("federation".to_string()),
          package: Some("@apollo/federation".to_string()),
          variation: Some(ProductVariation {
            id: "OSS".into()
          }),
        });
        products.push(Product {
          id: "apollo-federation".into(),
          sku: Some("federation".to_string()),
          package: Some("@apollo/federation".to_string()),
          variation: Some(ProductVariation {
            id: "OSS".into()
          }),
        });

      products.into_iter().find(|p| p.id == id)
    }

    #[graphql(entity)]
    async fn find_product_by_sku_and_package(&self, sku: String, package: String) -> Option<Product> {
      let mut products = Vec::new();
      products.push(Product {
          id: "apollo-federation".into(),
          sku: Some("federation".to_string()),
          package: Some("@apollo/federation".to_string()),
          variation: Some(ProductVariation {
            id: "OSS".into()
          }),
        });
        products.push(Product {
          id: "apollo-federation".into(),
          sku: Some("federation".to_string()),
          package: Some("@apollo/federation".to_string()),
          variation: Some(ProductVariation {
            id: "OSS".into()
          }),
        });

        // let ProductSkuPackageKey { sku, package } = key;

        products.into_iter().find(|p| p.sku == Some(sku.clone()) && p.package == Some(package.clone()))
    }

  // @key(fields: "sku variation { id }") {
    #[graphql(entity)]
    async fn find_product_by_sku_and_variation_id(&self, sku: String, variation: VariationIdKey) -> Option<Product> {
      let mut products = Vec::new();
      products.push(Product {
          id: "apollo-federation".into(),
          sku: Some("federation".to_string()),
          package: Some("@apollo/federation".to_string()),
          variation: Some(ProductVariation {
            id: "OSS".into()
          }),
        });
        products.push(Product {
          id: "apollo-federation".into(),
          sku: Some("federation".to_string()),
          package: Some("@apollo/federation".to_string()),
          variation: Some(ProductVariation {
            id: "OSS".into()
          }),
        });

        // let ProductSkuPackageKey { sku, package } = key;

        // products.into_iter().find(|p| p.sku == Some(sku.clone()) && p.variation.and_then(|v| Some(v.id == variation.id.clone())) == Some(true))
        products.into_iter().find(|p| p.sku == Some(sku.clone()))
    }

}

pub struct Product {
    id: ID,
    sku: Option<String>,
    package: Option<String>,
    variation: Option<ProductVariation>,
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

#[derive(SimpleObject)]
pub struct ProductVariation {
	id: ID,
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
