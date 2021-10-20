package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"server/graph/generated"
	"server/graph/model"
)

func (r *productResolver) CreatedBy(ctx context.Context, obj *model.Product) (*model.User, error) {
	return r.users[0], nil
}

func (r *queryResolver) Product(ctx context.Context, id string) (*model.Product, error) {
	for i := range r.products {
		if r.products[i].ID == id {
			return r.products[i], nil
		}
	}
	return nil, nil
}

// Product returns generated.ProductResolver implementation.
func (r *Resolver) Product() generated.ProductResolver { return &productResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type productResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
