package generated

import (
	"context"
	"encoding/json"
	"fmt"
	"subgraph/graph/model"
)

// PopulateUserRequires is the requires populator for the User entity.
func (ec *executionContext) PopulateUserRequires(ctx context.Context, entity *model.User, reps map[string]interface{}) error {
	if reps["totalProductsCreated"] != nil && reps["yearsOfEmployment"] != nil {
		totalProducts, err := reps["totalProductsCreated"].(json.Number).Int64()
		if err != nil {
			return fmt.Errorf("cannot convert totalProductsCreated to int64")
		}
		yearsOfEmployment, err := reps["yearsOfEmployment"].(json.Number).Int64()
		if err != nil {
			return fmt.Errorf("cannot convert yearsOfEmployment to int64")
		}
		averageProducts := int(totalProducts / yearsOfEmployment)
		entity.AverageProductsCreatedPerYear = &averageProducts

	}
	return nil
}
