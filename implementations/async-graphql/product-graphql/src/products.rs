use async_graphql::ID;
use crate::graphql::{Product, ProductVariation};

pub struct ProductRepository<'a> {
    pub products: Vec<Product<'a>>,
}

impl Default for ProductRepository<'_> {
    fn default() -> Self {
        let mut products = Vec::new();
        products.push(Product {
            id: "apollo-federation".into(),
            sku: Some("federation"),
            package: Some("@apollo/federation"),
            variation: Some(ProductVariation { id: "OSS".into() }),
        });
        products.push(Product {
            id: "apollo-studio".into(),
            sku: Some("sku"),
            package: Some(""),
            variation: Some(ProductVariation { id: "platform".into() }),
        });
        ProductRepository { products }
    }
}

impl ProductRepository<'_> {
	pub fn get(&self, id: ID) -> Option<Product> {
		(&self.products).into_iter()
			.find(|p| p.id == id)
			.and_then(|p| Some(p.clone()))
	}

	pub fn get_with_sku_and_package(&self, sku: String, package: String) -> Option<Product> {
		(&self.products).into_iter()
			.find(|p| p.sku == Some(&sku) && p.package == Some(&package))
			.and_then(|p| Some(p.clone()))
	}

	pub fn get_with_sku_and_variation_id(&self, sku: String, variation_id: ID) -> Option<Product> {
		(&self.products).into_iter()
			.find(|p| {
                let matches_sku = p.sku == Some(&sku);
                let matches_variation_id = match &p.variation {
                    Some(variation) => variation.id == variation_id,
                    None => false,
                };
                return matches_sku && matches_variation_id;
            })
			.and_then(|p| Some(p.clone()))
	}
}
