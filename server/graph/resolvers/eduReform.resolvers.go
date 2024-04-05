package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"fmt"
	graphql_models "server/graph/model"

	"github.com/99designs/gqlgen/graphql"
)

// CreateEduReform is the resolver for the createEduReform field.
func (r *mutationResolver) CreateEduReform(ctx context.Context, eduReformData graphql_models.EduReformData) (*graphql_models.EduReform, error) {
	panic(fmt.Errorf("not implemented: CreateEduReform - createEduReform"))
}

// UpdateEduReform is the resolver for the updateEduReform field.
func (r *mutationResolver) UpdateEduReform(ctx context.Context, id string, eduReformData graphql_models.EduReformData) (*graphql_models.EduReform, error) {
	panic(fmt.Errorf("not implemented: UpdateEduReform - updateEduReform"))
}

// DeleteEduReform is the resolver for the deleteEduReform field.
func (r *mutationResolver) DeleteEduReform(ctx context.Context, id string) (*graphql_models.EduReform, error) {
	panic(fmt.Errorf("not implemented: DeleteEduReform - deleteEduReform"))
}

// UploadEduReforms is the resolver for the uploadEduReforms field.
func (r *mutationResolver) UploadEduReforms(ctx context.Context, file graphql.Upload) ([]*graphql_models.EduReformPreview, error) {
	panic(fmt.Errorf("not implemented: UploadEduReforms - uploadEduReforms"))
}

// CreatedEduReforms is the resolver for the createdEduReforms field.
func (r *mutationResolver) CreateEduReforms(ctx context.Context, eduReformsData []*graphql_models.EduReformData) ([]*graphql_models.EduReform, error) {
	panic(fmt.Errorf("not implemented: CreatedEduReforms - createdEduReforms"))
}

// EduReform is the resolver for the eduReform field.
func (r *queryResolver) EduReform(ctx context.Context, id string) (*graphql_models.EduReform, error) {
	panic(fmt.Errorf("not implemented: EduReform - eduReform"))
}

// EduReformsByFilter is the resolver for the eduReformsByFilter field.
func (r *queryResolver) EduReformsByFilter(ctx context.Context, filter graphql_models.EduReformFilter) ([]*graphql_models.EduReform, error) {
	panic(fmt.Errorf("not implemented: EduReformsByFilter - eduReformsByFilter"))
}
