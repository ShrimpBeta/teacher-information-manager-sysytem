package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"errors"
	"server/environment"
	graphql_models "server/graph/model"
	"server/middlewares"

	redis "github.com/redis/go-redis/v9"
)

// DeleteAccount is the resolver for the deleteAccount field.
func (r *mutationResolver) DeleteAccount(ctx context.Context, userID string) (bool, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return false, err
	}

	_, err = middlewares.ForContext(ginContext)
	if err != nil {
		return false, err
	}

	return r.UserService.DeleteUser(userID)
}

// UpdateAccountPassword is the resolver for the updateAccountPassword field.
func (r *mutationResolver) UpdateAccountPassword(ctx context.Context, userID string, updatePasswordData graphql_models.UpdatePassword) (bool, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return false, err
	}

	_, err = middlewares.ForContext(ginContext)
	if err != nil {
		return false, err
	}

	return r.UserService.UpdatePassword(userID, updatePasswordData)
}

// ResetAccountPassword is the resolver for the resetAccountPassword field.
func (r *mutationResolver) ResetAccountPassword(ctx context.Context, resetPasswordData graphql_models.ResetPassword) (bool, error) {
	checkCode, err := r.RedisDB.Get(ctx, resetPasswordData.Email+"-reset").Result()
	if err == redis.Nil {
		return false, errors.New("code expired")
	} else if err != nil {
		return false, err
	}

	if checkCode != resetPasswordData.Code {
		return false, errors.New("wrong code")
	}

	// remove code after used
	err = r.RedisDB.Del(ctx, resetPasswordData.Email+"-reset").Err()
	if err != nil {
		return false, err
	}

	return r.UserService.ResetPassword(resetPasswordData)
}

// GenerateResetPasswordCode is the resolver for the generateResetPasswordCode field.
func (r *mutationResolver) GenerateResetPasswordCode(ctx context.Context, email string) (bool, error) {
	exists, err := r.UserService.UserExists(email)
	if err != nil {
		return false, err
	}

	if !exists {
		return false, errors.New("user not exists")
	}

	err = r.RedisDB.SetNX(ctx, email+"-generate", 0, environment.GenerateLimitTime).Err()
	if err != nil {
		return false, err
	}

	times := r.RedisDB.Incr(ctx, email+"-generate").Val()

	if times > 6 {
		return false, errors.New("get code too many times, please try after 12 hours")
	}

	code := r.UserService.GenerateCode()
	err = r.RedisDB.Set(ctx, email+"-reset", code, environment.CodeExpireTime).Err()
	if err != nil {
		return false, err
	}

	sended, err := r.UserService.SendEmailCode(email, code)
	if err != nil {
		return false, err
	}
	return sended, nil
}

// SignIn is the resolver for the signIn field.
func (r *mutationResolver) SignIn(ctx context.Context, signInData graphql_models.SigIn) (*graphql_models.SignInResponse, error) {
	return r.UserService.SignIn(signInData)
}

// UpdateUser is the resolver for the updateUser field.
func (r *mutationResolver) UpdateUser(ctx context.Context, userID string, userData graphql_models.UpdateUser) (*graphql_models.User, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	_, err = middlewares.ForContext(ginContext)
	if err != nil {
		return nil, err
	}

	return r.UserService.UpdateUser(userID, userData)
}

// ActivateUser is the resolver for the activateUser field.
func (r *mutationResolver) ActivateUser(ctx context.Context, userID string, userData graphql_models.ActivateUser) (*graphql_models.User, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	_, err = middlewares.ForContext(ginContext)
	if err != nil {
		return nil, err
	}

	return r.UserService.ActivateUser(userID, userData)
}

// WechatLogin is the resolver for the wechatLogin field.
func (r *mutationResolver) WechatLogin(ctx context.Context, code string) (*graphql_models.SignInResponse, error) {
	return r.UserService.WechatLogin(code)
}

// AddWechatAuth is the resolver for the addWechatAuth field.
func (r *mutationResolver) AddWechatAuth(ctx context.Context, userID string, code string) (bool, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return false, err
	}

	_, err = middlewares.ForContext(ginContext)
	if err != nil {
		return false, err
	}

	return r.UserService.AddWechatAuth(userID, code)
}

// RemoveWechatAuth is the resolver for the removeWechatAuth field.
func (r *mutationResolver) RemoveWechatAuth(ctx context.Context, userID string) (bool, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return false, err
	}

	_, err = middlewares.ForContext(ginContext)
	if err != nil {
		return false, err
	}

	return r.UserService.RemoveWechatAuth(userID)
}

// User is the resolver for the user field.
func (r *queryResolver) User(ctx context.Context, id string) (*graphql_models.User, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	_, err = middlewares.ForContext(ginContext)
	if err != nil {
		return nil, err
	}

	return r.UserService.GetUser(id)
}

// UserExports is the resolver for the userExports field.
func (r *queryResolver) UserExports(ctx context.Context) ([]*graphql_models.UserExport, error) {
	ginContext, err := middlewares.GinContextFromContext(ctx)
	if err != nil {
		return nil, err
	}

	_, err = middlewares.ForContext(ginContext)
	if err != nil {
		return nil, err
	}

	return r.UserService.GetUserExports()
}
