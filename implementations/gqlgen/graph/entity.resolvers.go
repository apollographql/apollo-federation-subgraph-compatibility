package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"subgraph/graph/generated"
	"subgraph/graph/model"
)

func (r *entityResolver) FindProductByID(ctx context.Context, id string) (*model.Product, error) {
	for i := range r.products {
		if r.products[i].ID == id {
			return r.products[i], nil
		}
	}
	return nil, nil
}

func (r *entityResolver) FindProductBySkuAndPackage(ctx context.Context, sku *string, packageArg *string) (*model.Product, error) {
	println("%s %s", *sku, *packageArg)
	for i := range r.products {
		if *r.products[i].Sku == *sku && *r.products[i].Package == *packageArg {
			return r.products[i], nil
		}
	}
	return nil, nil
}

func (r *entityResolver) FindProductBySkuAndVariationID(ctx context.Context, sku *string, variationID string) (*model.Product, error) {
	for i := range r.products {
		if *r.products[i].Sku == *sku && r.products[i].Variation.ID == variationID {
			return r.products[i], nil
		}
	}
	return nil, nil
}

// Entity returns generated.EntityResolver implementation.
func (r *Resolver) Entity() generated.EntityResolver { return &entityResolver{r} }

type entityResolver struct{ *Resolver }
