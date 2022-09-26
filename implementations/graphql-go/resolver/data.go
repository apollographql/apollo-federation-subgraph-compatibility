package resolver

import "graphql-go-compatibility/model"

var federationSku = "federation"
var federationPackage = "@apollo/federation"

var studioSku = "studio"

var productSize = "small"
var productWeight = 1.0
var productUnit = "kg"

var products = []*model.Product{
	{
		ID:        "apollo-federation",
		Sku:       &federationSku,
		Package:   &federationPackage,
		Variation: &model.ProductVariation{ID: "OSS"},
		Dimensions: &model.ProductDimension{
			Size:   &productSize,
			Weight: &productWeight,
			Unit:   &productUnit,
		},
	},
	{
		ID:        "apollo-studio",
		Sku:       &studioSku,
		Package:   nil,
		Variation: &model.ProductVariation{ID: "platform"},
		Dimensions: &model.ProductDimension{
			Size:   &productSize,
			Weight: &productWeight,
			Unit:   &productUnit,
		},
	},
}

var userName = "Jane Smith"
var totalProductsCreated = 1337

var users = []*model.User{
	{
		Email:                "support@apollographql.com",
		Name:                 &userName,
		TotalProductsCreated: &totalProductsCreated,
	},
}

var DefaultUser = users[0]

var deprecationReason = "Migrate to Federation V2"

var deprecatedProducts = []*model.DeprecatedProduct{
	{
		Sku:     "apollo-federation-v1",
		Package: "@apollo/federation-v1",
		Reason:  &deprecationReason,
	},
}

var federationStudyDescription = "Federation Study"
var studioStudyDescription = "Studio Study"

var research = []*model.ProductResearch{
	{
		Study: &model.CaseStudy{
			CaseNumber:  "1234",
			Description: &federationStudyDescription,
		},
	},
	{
		Study: &model.CaseStudy{
			CaseNumber:  "1235",
			Description: &studioStudyDescription,
		},
	},
}
