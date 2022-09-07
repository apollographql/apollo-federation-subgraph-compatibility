package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"subgraph/graph/generated"
	"subgraph/graph/model"
)

// FindDeprecatedProductBySkuAndPackage is the resolver for the findDeprecatedProductBySkuAndPackage field.
func (r *entityResolver) FindDeprecatedProductBySkuAndPackage(ctx context.Context, sku string, packageArg string) (*model.DeprecatedProduct, error) {
	for i := range r.deprecatedProducts {
		if r.deprecatedProducts[i].Sku == sku && r.deprecatedProducts[i].Package == packageArg {
			return r.deprecatedProducts[i], nil
		}
	}
	return nil, nil
}

// FindProductByID is the resolver for the findProductByID field.
func (r *entityResolver) FindProductByID(ctx context.Context, id string) (*model.Product, error) {
	for i := range r.products {
		if r.products[i].ID == id {
			return r.products[i], nil
		}
	}
	return nil, nil
}

// FindProductBySkuAndPackage is the resolver for the findProductBySkuAndPackage field.
func (r *entityResolver) FindProductBySkuAndPackage(ctx context.Context, sku *string, packageArg *string) (*model.Product, error) {
	for i := range r.products {
		if *r.products[i].Sku == *sku && *r.products[i].Package == *packageArg {
			return r.products[i], nil
		}
	}
	return nil, nil
}

// FindProductBySkuAndVariationID is the resolver for the findProductBySkuAndVariationID field.
func (r *entityResolver) FindProductBySkuAndVariationID(ctx context.Context, sku *string, variationID string) (*model.Product, error) {
	for i := range r.products {
		if *r.products[i].Sku == *sku && r.products[i].Variation.ID == variationID {
			return r.products[i], nil
		}
	}
	return nil, nil
}

// FindProductResearchByStudyCaseNumber is the resolver for the findProductResearchByStudyCaseNumber field.
func (r *entityResolver) FindProductResearchByStudyCaseNumber(ctx context.Context, studyCaseNumber string) (*model.ProductResearch, error) {
	for i := range r.research {
		if r.research[i].Study.CaseNumber == studyCaseNumber {
			return r.research[i], nil
		}
	}
	return nil, nil
}

// FindUserByEmail is the resolver for the findUserByEmail field.
func (r *entityResolver) FindUserByEmail(ctx context.Context, email string) (*model.User, error) {
	for i := range r.users {
		if r.users[i].Email == email {
			return r.users[i], nil
		}
	}
	return nil, nil
}

// Entity returns generated.EntityResolver implementation.
func (r *Resolver) Entity() generated.EntityResolver { return &entityResolver{r} }

type entityResolver struct{ *Resolver }
