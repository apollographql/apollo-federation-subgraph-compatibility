package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"server/graph/generated"
	"server/graph/model"
)

func (r *entityResolver) FindProductByID(ctx context.Context, id string) (*model.Product, error) {
	for i := range r.products {
		if r.products[i].ID == id {
			return r.products[i], nil
		}
	}
	return nil, nil
}

// Entity returns generated.EntityResolver implementation.
func (r *Resolver) Entity() generated.EntityResolver { return &entityResolver{r} }

type entityResolver struct{ *Resolver }
