package graph

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

import (
	"server/graph/model"
)

var federationSku = "federation"
var federationPackage = "@apollo/federation"

var studioSku = "studio"

var productSize = "1"
var productWeight = 1.0

var products = []*model.Product{
	&model.Product{
		ID:        "apollo-federation",
		Sku:       &federationSku,
		Package:   &federationPackage,
		Variation: &model.ProductVariation{ID: "OSS"},
		Dimensions: &model.ProductDimension{
			Size:   &productSize,
			Weight: &productWeight,
		},
	},
	&model.Product{
		ID:        "apollo-studio",
		Sku:       &studioSku,
		Package:   nil,
		Variation: &model.ProductVariation{ID: "platform"},
		Dimensions: &model.ProductDimension{
			Size:   &productSize,
			Weight: &productWeight,
		},
	},
}

var totalProductsCreated = 1337

var users = []*model.User{
	&model.User{
		Email:                "support@apollographql.com",
		TotalProductsCreated: &totalProductsCreated,
	},
}

type Resolver struct {
	products []*model.Product
	users []*model.User
}

func NewRootResolver() *Resolver {
	return &Resolver{
		products: products,
		users:    users,
	}
}
