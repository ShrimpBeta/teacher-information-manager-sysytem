package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"fmt"
	graphql_models "server/graph/model"
)

// DeleteAccount is the resolver for the deleteAccount field.
func (r *mutationResolver) DeleteAccount(ctx context.Context, userID string) (bool, error) {
	return r.UserService.DeleteUser(userID)
}

// UpdateAccountPassword is the resolver for the updateAccountPassword field.
func (r *mutationResolver) UpdateAccountPassword(ctx context.Context, userID string, updatePasswordData graphql_models.UpdatePassword) (bool, error) {
	panic(fmt.Errorf("not implemented: UpdateAccountPassword - updateAccountPassword"))
}

// ResetAccountPassword is the resolver for the resetAccountPassword field.
func (r *mutationResolver) ResetAccountPassword(ctx context.Context, userID string, resetPasswordData graphql_models.ResetPassword) (bool, error) {
	panic(fmt.Errorf("not implemented: ResetAccountPassword - resetAccountPassword"))
}

// SignIn is the resolver for the signIn field.
func (r *mutationResolver) SignIn(ctx context.Context, signInData graphql_models.SigIn) (*graphql_models.SignInResponse, error) {
	return r.UserService.SignIn(signInData)
}

// UpdateUser is the resolver for the updateUser field.
func (r *mutationResolver) UpdateUser(ctx context.Context, userID string, userData graphql_models.UpdateUser) (*graphql_models.User, error) {
	return r.UserService.UpdateUser(userID, userData)
}

// ActivateUser is the resolver for the activateUser field.
func (r *mutationResolver) ActivateUser(ctx context.Context, userID string, userData graphql_models.ActivateUser) (*graphql_models.User, error) {
	return r.UserService.ActivateUser(userID, userData)
}

// AddWechatAuth is the resolver for the addWechatAuth field.
func (r *mutationResolver) AddWechatAuth(ctx context.Context, userID string, wechatAuthData graphql_models.WechatAuth) (bool, error) {
	panic(fmt.Errorf("not implemented: AddWechatAuth - addWechatAuth"))
}

// RemoveWechatAuth is the resolver for the removeWechatAuth field.
func (r *mutationResolver) RemoveWechatAuth(ctx context.Context, userID string) (bool, error) {
	panic(fmt.Errorf("not implemented: RemoveWechatAuth - removeWechatAuth"))
}

// User is the resolver for the user field.
func (r *queryResolver) User(ctx context.Context, id string) (*graphql_models.User, error) {
	return r.UserService.GetUser(id)
}

// UserExports is the resolver for the userExports field.
func (r *queryResolver) UserExports(ctx context.Context) ([]*graphql_models.UserExport, error) {
	return r.UserService.GetUserExports()
}
