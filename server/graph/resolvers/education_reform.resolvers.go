package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"fmt"
	models "server/graph/model"
)

// CreateEducationReform is the resolver for the createEducationReform field.
func (r *mutationResolver) CreateEducationReform(ctx context.Context, input *models.NewEducationReform) (*models.EducationReform, error) {
	panic(fmt.Errorf("not implemented: CreateEducationReform - createEducationReform"))
}

// EducationReform is the resolver for the educationReform field.
func (r *queryResolver) EducationReform(ctx context.Context, id string) (*models.EducationReform, error) {
	panic(fmt.Errorf("not implemented: EducationReform - educationReform"))
}

// EducationReforms is the resolver for the educationReforms field.
func (r *queryResolver) EducationReforms(ctx context.Context, teacherid string) ([]*models.EducationReform, error) {
	panic(fmt.Errorf("not implemented: EducationReforms - educationReforms"))
}