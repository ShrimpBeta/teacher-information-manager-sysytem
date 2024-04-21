package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"fmt"
	graphql_models "server/graph/model"
	"server/middlewares"

	"github.com/99designs/gqlgen/graphql"
)

// CreatePassword is the resolver for the createPassword field.
func (r *mutationResolver) CreatePassword(ctx context.Context, passwordData graphql_models.PasswordData) (*graphql_models.Password, error) {
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

	return r.PasswordService.CreatePassword(user.ID, user.MasterKey, passwordData)
}

// UpdatePassword is the resolver for the updatePassword field.
func (r *mutationResolver) UpdatePassword(ctx context.Context, id string, passwordData graphql_models.PasswordData) (*graphql_models.Password, error) {
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

	return r.PasswordService.UpdatePassword(user.ID, id, user.MasterKey, passwordData)
}

// DeletePassword is the resolver for the deletePassword field.
func (r *mutationResolver) DeletePassword(ctx context.Context, id string) (*graphql_models.Password, error) {
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

	return r.PasswordService.DeletePassword(user.ID, id)
}

// UploadPasswords is the resolver for the uploadPasswords field.
func (r *mutationResolver) UploadPasswords(ctx context.Context, file graphql.Upload) ([]*graphql_models.PasswordPreview, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	_, err = middlewares.ForContext(ginContext)
	if err != nil {
		return nil, err
	}

	panic(fmt.Errorf("not implemented: UploadPasswords - uploadPasswords"))
}

// PasswordTrue is the resolver for the passwordTrue field.
func (r *queryResolver) PasswordTrue(ctx context.Context, id string) (*graphql_models.PasswordTrue, error) {
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

	return r.PasswordService.GetPasswordTrueById(user.ID, id, user.MasterKey)
}

// PasswordsByFilter is the resolver for the passwordsByFilter field.
func (r *queryResolver) PasswordsByFilter(ctx context.Context, filter graphql_models.PasswordFilter, offset int, limit int) (*graphql_models.PasswordsQuery, error) {
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

	return r.PasswordService.GetPasswordsByFilter(user.ID, filter, offset, limit)
}

// PasswordsTrue is the resolver for the passwordsTrue field.
func (r *queryResolver) PasswordsTrue(ctx context.Context, ids []*string) ([]*graphql_models.PasswordTrue, error) {
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

	return r.PasswordService.GetPasswordsByIds(user.ID, ids, user.MasterKey)
}
