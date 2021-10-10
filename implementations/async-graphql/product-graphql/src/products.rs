use async_graphql::ID;
use crate::graphql::{Product, ProductVariation};

pub struct ProductRepository {
    pub products: Vec<Product>,
}

impl Default for ProductRepository {
    fn default() -> Self {
        let mut products = Vec::new();
        products.push(Product {
            id: "apollo-federation".into(),
            sku: Some("federation".to_string()),
            package: Some("@apollo/federation".to_string()),
            variation: Some(ProductVariation { id: "OSS".into() }),
        });
        products.push(Product {
            id: "apollo-studio".into(),
            sku: Some("sku".to_string()),
            package: Some("".to_string()),
            variation: Some(ProductVariation { id: "platform".into() }),
        });
        ProductRepository { products }
    }
}

impl ProductRepository {
	pub fn get(&self, id: ID) -> Option<Product> {
		(&self.products).into_iter()
			.find(|p| p.id == id)
			.and_then(|p| Some(p.clone()))
	}

	pub fn get_with_sku_and_package(&self, sku: String, package: String) -> Option<Product> {
		(&self.products).into_iter()
			.find(|p| p.sku == Some(sku.clone()) && p.package == Some(package.clone()))
			.and_then(|p| Some(p.clone()))
	}

	pub fn get_with_sku_and_variation_id(&self, sku: String, variation_id: ID) -> Option<Product> {
		(&self.products).into_iter()
			.find(|p| {
                let matches_sku = p.sku == Some(sku.clone());
                let matches_variation_id = match &p.variation {
                    Some(variation) => variation.id == variation_id,
                    None => false,
                };
                return matches_sku && matches_variation_id;
            })
			.and_then(|p| Some(p.clone()))
	}
}
