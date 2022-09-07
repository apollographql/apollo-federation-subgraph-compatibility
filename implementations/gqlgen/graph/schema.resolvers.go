package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"math"
	"subgraph/graph/generated"
	"subgraph/graph/model"
)

// CreatedBy is the resolver for the createdBy field.
func (r *deprecatedProductResolver) CreatedBy(ctx context.Context, obj *model.DeprecatedProduct) (*model.User, error) {
	return r.users[0], nil
}

// CreatedBy is the resolver for the createdBy field.
func (r *productResolver) CreatedBy(ctx context.Context, obj *model.Product) (*model.User, error) {
	return r.users[0], nil
}

// Research is the resolver for the research field.
func (r *productResolver) Research(ctx context.Context, obj *model.Product) ([]*model.ProductResearch, error) {
	var research []*model.ProductResearch

	for i := range r.research {
		if (r.research[i].Study.CaseNumber == "Federation Study" && obj.ID == "apollo-federation") ||
			(r.research[i].Study.CaseNumber == "Studio Study" && obj.ID == "apollo-studio") {
			research = append(research, r.research[i])
		}
	}

	return research, nil
}

// Product is the resolver for the product field.
func (r *queryResolver) Product(ctx context.Context, id string) (*model.Product, error) {
	for i := range r.products {
		if r.products[i].ID == id {
			return r.products[i], nil
		}
	}
	return nil, nil
}

// DeprecatedProduct is the resolver for the deprecatedProduct field.
func (r *queryResolver) DeprecatedProduct(ctx context.Context, sku string, packageArg string) (*model.DeprecatedProduct, error) {
	for i := range r.deprecatedProducts {
		if r.deprecatedProducts[i].Sku == sku && r.deprecatedProducts[i].Package == packageArg {
			return r.deprecatedProducts[i], nil
		}
	}
	return nil, nil
}

// AverageProductsCreatedPerYear is the resolver for the averageProductsCreatedPerYear field.
func (r *userResolver) AverageProductsCreatedPerYear(ctx context.Context, obj *model.User) (*int, error) {
	if obj.TotalProductsCreated == nil {
		return nil, nil
	}
	var avgProductsCreated = int(math.Round(float64(*obj.TotalProductsCreated) / float64(obj.YearsOfEmployment)))
	return &avgProductsCreated, nil
}

// DeprecatedProduct returns generated.DeprecatedProductResolver implementation.
func (r *Resolver) DeprecatedProduct() generated.DeprecatedProductResolver {
	return &deprecatedProductResolver{r}
}

// Product returns generated.ProductResolver implementation.
func (r *Resolver) Product() generated.ProductResolver { return &productResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type deprecatedProductResolver struct{ *Resolver }
type productResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
