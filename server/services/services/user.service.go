package services

import (
	"fmt"
	"io"
	"server/environment"
	graphql_models "server/graph/model"
	"server/persistence/repository"
	"server/services/avatar"
	"server/services/jwt"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserService struct {
	Repo *repository.UserRepo
}

func NewUserService(r *repository.UserRepo) *UserService {
	return &UserService{Repo: r}
}

func (u *UserService) SignIn(signInData graphql_models.SigIn) (*graphql_models.SignInResponse, error) {

	userData, err := u.Repo.GetUserByEmailAndPassword(signInData.Email, signInData.Password)
	if err != nil {
		return nil, err
	}
	if userData == nil {
		return nil, fmt.Errorf("user not found")
	}
	token, err := jwt.GenerateToken(userData.Email)
	if err != nil {
		return nil, err
	}

	wechatAuth := false
	if *userData.WechatOpenId != "" {
		wechatAuth = true
	}

	return &graphql_models.SignInResponse{
		Token: token,
		User: &graphql_models.User{
			ID:          userData.ID.Hex(),
			Username:    userData.Username,
			Email:       userData.Email,
			PhoneNumber: userData.Phone,
			WechatAuth:  wechatAuth,
			Avatar:      environment.ServeURL + "/avatars/" + userData.Avatar,
			Activate:    userData.Activate,
			CreatedAt:   userData.CreatedAt.Time(),
			UpdatedAt:   userData.UpdatedAt.Time(),
		},
	}, nil

}

func (u *UserService) UpdateUser(userID string, userData graphql_models.UpdateUser) (*graphql_models.User, error) {

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	userUpdate, err := u.Repo.GetUserById(objectID)
	if err != nil {
		return nil, err
	}

	userUpdate.Username = userData.Username

	if userData.Avatar != nil {
		file := userData.Avatar.File

		// check file type
		if userData.Avatar.ContentType != "image/png" &&
			userData.Avatar.ContentType != "image/jpeg" &&
			userData.Avatar.ContentType != "image/jpg" &&
			userData.Avatar.ContentType != "image/webp" {
			return nil, fmt.Errorf("only png,jpeg,jpg,webp file is allowed")
		}

		// Read the contents of the file
		data, err := io.ReadAll(file)
		if err != nil {
			return nil, err
		}

		// Pass the data as []byte to the SaveAvatar function
		avatar, err := avatar.SaveAvatar(data)
		if err != nil {
			return nil, err
		}
		userUpdate.Avatar = avatar
	}

	if userData.PhoneNumber != nil {
		userUpdate.Phone = userData.PhoneNumber
	}
	userUpdate.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	err = u.Repo.UpdateUser(userUpdate)
	if err != nil {
		return nil, err
	}
	userUpdate, err = u.Repo.GetUserById(objectID)
	if err != nil {
		return nil, err
	}

	wechatAuth := false
	if *userUpdate.WechatOpenId != "" {
		wechatAuth = true
	}
	return &graphql_models.User{
		ID:          userUpdate.ID.Hex(),
		Email:       userUpdate.Email,
		Username:    userUpdate.Username,
		Avatar:      environment.ServeURL + "/avatars/" + userUpdate.Avatar,
		PhoneNumber: userUpdate.Phone,
		WechatAuth:  wechatAuth,
		Activate:    userUpdate.Activate,
		CreatedAt:   userUpdate.CreatedAt.Time(),
		UpdatedAt:   userUpdate.UpdatedAt.Time(),
	}, nil

}

func (u *UserService) ActivateUser(userID string, userData graphql_models.ActivateUser) (*graphql_models.User, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	userUpdate, err := u.Repo.GetUserById(objectID)
	if err != nil {
		return nil, err
	}

	userUpdate.Activate = true
	userUpdate.Username = userData.Username
	userUpdate.Password = userData.Password
	if userData.Avatar != nil {
		file := userData.Avatar.File

		// check file type
		if userData.Avatar.ContentType != "image/png" &&
			userData.Avatar.ContentType != "image/jpeg" &&
			userData.Avatar.ContentType != "image/jpg" &&
			userData.Avatar.ContentType != "image/webp" {
			return nil, fmt.Errorf("only png,jpeg,jpg,webp file is allowed")
		}

		// Read the contents of the file
		data, err := io.ReadAll(file)
		if err != nil {
			return nil, err
		}

		// Pass the data as []byte to the SaveAvatar function
		avatar, err := avatar.SaveAvatar(data)
		if err != nil {
			return nil, err
		}
		userUpdate.Avatar = avatar

	}

	if userData.PhoneNumber != nil {
		userUpdate.Phone = userData.PhoneNumber
	}

	err = u.Repo.UpdateUser(userUpdate)
	if err != nil {
		return nil, err
	}
	userUpdate, err = u.Repo.GetUserById(objectID)
	if err != nil {
		return nil, err
	}

	wechatAuth := false
	if *userUpdate.WechatOpenId != "" {
		wechatAuth = true
	}

	return &graphql_models.User{
		ID:          userUpdate.ID.Hex(),
		Email:       userUpdate.Email,
		Username:    userUpdate.Username,
		Avatar:      environment.ServeURL + "/avatars/" + userUpdate.Avatar,
		PhoneNumber: userUpdate.Phone,
		WechatAuth:  wechatAuth,
		Activate:    userUpdate.Activate,
		CreatedAt:   userUpdate.CreatedAt.Time(),
		UpdatedAt:   userUpdate.UpdatedAt.Time(),
	}, nil
}

func (u *UserService) ResetPassword() error {
	return nil
}

func (u *UserService) ForgetPassword() error {
	return nil
}

func (u *UserService) GetUser(id string) (*graphql_models.User, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	userData, err := u.Repo.GetUserById(objectID)
	if err != nil {
		return nil, err
	}

	wechatAuth := false
	if *userData.WechatOpenId != "" {
		wechatAuth = true
	}

	return &graphql_models.User{
		ID:          userData.ID.Hex(),
		Email:       userData.Email,
		Username:    userData.Username,
		Avatar:      environment.ServeURL + "/avatars/" + userData.Avatar,
		PhoneNumber: userData.Phone,
		WechatAuth:  wechatAuth,
		Activate:    userData.Activate,
		CreatedAt:   userData.CreatedAt.Time(),
		UpdatedAt:   userData.UpdatedAt.Time(),
	}, nil
}

func (u *UserService) GetUserExports() ([]*graphql_models.UserExport, error) {
	userDatas, err := u.Repo.GetAllUsers()
	if err != nil {
		return nil, err
	}
	var users []*graphql_models.UserExport
	for _, userData := range userDatas {
		users = append(users, &graphql_models.UserExport{
			ID:        userData.ID.Hex(),
			Username:  userData.Username,
			Email:     userData.Email,
			Avatar:    "/avatars/" + userData.Avatar,
			CreatedAt: userData.CreatedAt.Time(),
		})
	}
	return users, nil
}

func (u *UserService) DeleteUser(userID string) (bool, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return false, err
	}

	err = u.Repo.DeleteUser(objectID)
	if err != nil {
		return false, err
	}

	return true, nil
}
