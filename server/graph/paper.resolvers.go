package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"fmt"
	models "server/graph/model"
	"time"
)

// CreatePaper is the resolver for the createPaper field.
func (r *mutationResolver) CreatePaper(ctx context.Context, teachersIn []*string, teachersOut []*string, title *string, publishDate *time.Time, rank *string, journalName *string, journalLevel *string) (*models.Paper, error) {
	panic(fmt.Errorf("not implemented: CreatePaper - createPaper"))
}

// Paper is the resolver for the paper field.
func (r *queryResolver) Paper(ctx context.Context, id string) (*models.Paper, error) {
	panic(fmt.Errorf("not implemented: Paper - paper"))
}

// Papers is the resolver for the papers field.
func (r *queryResolver) Papers(ctx context.Context, teacherID string) ([]*models.Paper, error) {
	panic(fmt.Errorf("not implemented: Papers - papers"))
}
