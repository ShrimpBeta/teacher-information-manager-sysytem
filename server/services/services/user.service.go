package services

import (
	"fmt"
	"io"
	"math/rand"
	"server/environment"
	graphql_models "server/graph/model"
	"server/persistence/repository"
	"server/services/avatar"
	"server/services/email"
	"server/services/jwt"
	passwordencrypt "server/services/passwordEncrypt"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserService struct {
	Repo *repository.UserRepo
}

func NewUserService(userRepo *repository.UserRepo) *UserService {
	return &UserService{Repo: userRepo}
}

func (userService *UserService) SignIn(signInData graphql_models.SigIn) (*graphql_models.SignInResponse, error) {

	userData, err := userService.Repo.GetUserByEmail(signInData.Email)
	if err != nil {
		return nil, err
	}

	if userData == nil {
		return nil, fmt.Errorf("user not found")
	}

	if userData.Password != passwordencrypt.HashPassword(signInData.Password, userData.Salt) {
		return nil, fmt.Errorf("wrong password")
	}

	// generate token
	token, err := jwt.GenerateToken(userData.Email, environment.UserTokenExpireTime)
	if err != nil {
		return nil, err
	}

	// check wechat auth
	wechatAuth := false
	if userData.WechatOpenId != nil && *userData.WechatOpenId != "" {
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

func (userService *UserService) UpdateUser(userID string, userData graphql_models.UpdateUser) (*graphql_models.User, error) {

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	userUpdate, err := userService.Repo.GetUserById(objectID)
	if err != nil {
		return nil, err
	}

	userUpdate.Username = userData.Username

	if userData.Avatar != nil {
		file := userData.Avatar.File

		// file type
		mimeExtensions := map[string]string{
			"image/png":  ".png",
			"image/jpeg": ".jpeg",
			"image/jpg":  ".jpg",
			"image/webp": ".webp",
		}

		// get file type
		filetypeName, exists := mimeExtensions[userData.Avatar.ContentType]

		if !exists {
			return nil, fmt.Errorf("only png,jpeg,jpg,webp file is allowed")
		}

		// Read the contents of the file
		data, err := io.ReadAll(file)
		if err != nil {
			return nil, err
		}

		// Pass the data as []byte to the SaveAvatar function
		userAvatar, err := avatar.SaveAvatar(data, filetypeName)
		if err != nil {
			return nil, err
		}

		// delete old avatar
		oldavatar := userUpdate.Avatar
		avatar.DeleteAvatar(oldavatar)

		userUpdate.Avatar = userAvatar
	}

	if userData.PhoneNumber != nil {
		userUpdate.Phone = userData.PhoneNumber
	}

	userUpdate.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())

	err = userService.Repo.UpdateUser(userUpdate)
	if err != nil {
		return nil, err
	}

	userUpdate, err = userService.Repo.GetUserById(objectID)
	if err != nil {
		return nil, err
	}

	wechatAuth := false
	if userUpdate.WechatOpenId != nil && *userUpdate.WechatOpenId != "" {
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

func (userService *UserService) ActivateUser(userID string, userData graphql_models.ActivateUser) (*graphql_models.User, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	// get user by id
	userUpdate, err := userService.Repo.GetUserById(objectID)
	if err != nil {
		return nil, err
	}

	userUpdate.Activate = true
	userUpdate.Username = userData.Username
	userUpdate.Password = passwordencrypt.HashPassword(userData.Password, userUpdate.Salt)

	if userData.Avatar != nil {
		file := userData.Avatar.File

		// file type
		mimeExtensions := map[string]string{
			"image/png":  ".png",
			"image/jpeg": ".jpeg",
			"image/jpg":  ".jpg",
			"image/webp": ".webp",
		}

		// get file type
		filetypeName, exists := mimeExtensions[userData.Avatar.ContentType]

		if !exists {
			return nil, fmt.Errorf("only png,jpeg,jpg,webp file is allowed")
		}

		// Read the contents of the file
		data, err := io.ReadAll(file)
		if err != nil {
			return nil, err
		}

		// Pass the data as []byte to the SaveAvatar function
		userAvatar, err := avatar.SaveAvatar(data, filetypeName)
		if err != nil {
			return nil, err
		}

		// delete old avatar
		oldavatar := userUpdate.Avatar
		avatar.DeleteAvatar(oldavatar)

		userUpdate.Avatar = userAvatar

	}

	if userData.PhoneNumber != nil {
		userUpdate.Phone = userData.PhoneNumber
	}

	err = userService.Repo.UpdateUser(userUpdate)
	if err != nil {
		return nil, err
	}
	userUpdate, err = userService.Repo.GetUserById(objectID)
	if err != nil {
		return nil, err
	}

	wechatAuth := false
	if userUpdate.WechatOpenId != nil && *userUpdate.WechatOpenId != "" {
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

func (userService *UserService) UpdatePassword(userID string, updatePasswordData graphql_models.UpdatePassword) (bool, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return false, err
	}

	userData, err := userService.Repo.GetUserById(objectID)
	if err != nil {
		return false, err
	}

	if userData.Password != passwordencrypt.HashPassword(updatePasswordData.OldPassword, userData.Salt) {
		return false, fmt.Errorf("wrong password")
	}

	userData.Password = passwordencrypt.HashPassword(updatePasswordData.NewPassword, userData.Salt)

	err = userService.Repo.UpdateUser(userData)
	if err != nil {
		return false, err
	}

	return true, nil
}

func (userService *UserService) ResetPassword(resetPasswordData graphql_models.ResetPassword) (bool, error) {

	userData, err := userService.Repo.GetUserByEmail(resetPasswordData.Email)
	if err != nil {
		return false, err
	}
	userData.Password = passwordencrypt.HashPassword(resetPasswordData.NewPassword, userData.Salt)

	err = userService.Repo.UpdateUser(userData)
	if err != nil {
		return false, err
	}

	return true, nil
}

func (userService *UserService) GetUser(id string) (*graphql_models.User, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	userData, err := userService.Repo.GetUserById(objectID)
	if err != nil {
		return nil, err
	}

	wechatAuth := false
	if userData.WechatOpenId != nil && *userData.WechatOpenId != "" {
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

func (userService *UserService) GetUserExports() ([]*graphql_models.UserExport, error) {
	userDatas, err := userService.Repo.GetAllUsers()
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

func (userService *UserService) DeleteUser(userID string) (bool, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return false, err
	}

	err = userService.Repo.DeleteUser(objectID)
	if err != nil {
		return false, err
	}

	return true, nil
}

func (userService *UserService) UserExists(email string) (bool, error) {
	userData, err := userService.Repo.GetUserByEmail(email)
	if err != nil {
		return false, err
	}

	if userData != nil {
		return true, nil
	}

	return false, nil
}

// generate 6 bit random code
func (userService *UserService) GenerateCode() string {
	random := rand.New(rand.NewSource(time.Now().UnixNano()))
	bytes := make([]byte, 6)
	for i := range bytes {
		bytes[i] = byte(48 + random.Intn(10))
	}
	return string(bytes)
}

func (userService *UserService) SendEmailCode(receiverEmail string, code string) (bool, error) {
	content := fmt.Sprintf("亲爱的 %s 用户，您的验证码是 %s ，有效时间为5分钟（请注意有效期）", receiverEmail, code)
	err := email.SendEmail(content, receiverEmail)
	if err != nil {
		return false, err
	}
	return true, nil
}
