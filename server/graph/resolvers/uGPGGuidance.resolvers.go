package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"io"
	graphql_models "server/graph/model"
	"server/middlewares"
	"server/services/excel"

	"github.com/99designs/gqlgen/graphql"
)

// CreateUPGuidance is the resolver for the createUPGuidance field.
func (r *mutationResolver) CreateUGPGGuidance(ctx context.Context, uGPGGuidanceData graphql_models.UGPGGuidanceData) (*graphql_models.UGPGGuidance, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	account, err := middlewares.ForContext(ginContext)
	if err != nil {
		return nil, err
	}

	user, err := r.UserService.Repo.GetUserByEmail(account.Account)
	if err != nil {
		return nil, err
	}

	return r.UGPGGuidanceService.CreateUGPGGuidance(user.ID, uGPGGuidanceData)
}

// UpdateUPGuidance is the resolver for the updateUPGuidance field.
func (r *mutationResolver) UpdateUGPGGuidance(ctx context.Context, id string, uGPGGuidanceData graphql_models.UGPGGuidanceData) (*graphql_models.UGPGGuidance, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	// if no token found, return an error
	account, err := middlewares.ForContext(ginContext)
	if err != nil {
		return nil, err
	}

	user, err := r.UserService.Repo.GetUserByEmail(account.Account)
	if err != nil {
		return nil, err
	}

	return r.UGPGGuidanceService.UpdateUGPGGuidance(user.ID, id, uGPGGuidanceData)
}

// DeleteUPGuidance is the resolver for the deleteUPGuidance field.
func (r *mutationResolver) DeleteUGPGGuidance(ctx context.Context, id string) (*graphql_models.UGPGGuidance, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	// if no token found, return an error
	account, err := middlewares.ForContext(ginContext)
	if err != nil {
		return nil, err
	}

	user, err := r.UserService.Repo.GetUserByEmail(account.Account)
	if err != nil {
		return nil, err
	}

	return r.UGPGGuidanceService.DeleteUGPGGuidance(user.ID, id)
}

// UploadUGPGGuidances is the resolver for the uploadUGPGGuidances field.
func (r *mutationResolver) UploadUGPGGuidances(ctx context.Context, file graphql.Upload) ([]*graphql_models.UGPGGuidancePreview, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	_, err = middlewares.ForContext(ginContext)
	if err != nil {
		return nil, err
	}

	if file.ContentType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" {
		fileBytes, err := io.ReadAll(file.File)
		if err != nil {
			return nil, err
		}
		return excel.ConvertToUGPGGuidance(fileBytes)
	} else {
		return nil, nil
	}
}

// UGPGGuidance is the resolver for the uGPGGuidance field.
func (r *queryResolver) UGPGGuidance(ctx context.Context, id string) (*graphql_models.UGPGGuidance, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	// if no token found, return an error
	account, err := middlewares.ForContext(ginContext)
	if err != nil {
		return nil, err
	}

	user, err := r.UserService.Repo.GetUserByEmail(account.Account)
	if err != nil {
		return nil, err
	}

	return r.UGPGGuidanceService.GetUGPGGuidanceById(user.ID, id)
}

// UGPGGuidancesByFilter is the resolver for the uGPGGuidancesByFilter field.
func (r *queryResolver) UGPGGuidancesByFilter(ctx context.Context, filter graphql_models.UGPGGuidanceFilter, offset int, limit int) (*graphql_models.UGPGGuidanceQuery, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	account, err := middlewares.ForContext(ginContext)
	if err != nil {
		return nil, err
	}

	user, err := r.UserService.Repo.GetUserByEmail(account.Account)
	if err != nil {
		return nil, err
	}

	return r.UGPGGuidanceService.GetUGPGGuidancesByFilter(user.ID, filter, offset, limit)
}
