package services

import (
	"server/environment"
	"server/persistence/models"
	"server/persistence/repository"

	"server/services/avatar"
	passwordencrypt "server/services/passwordEncrypt"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AccountService struct {
	Repo *repository.UserRepo
}

func NewAccountService(userRepo *repository.UserRepo) *AccountService {
	return &AccountService{Repo: userRepo}
}

func (accountService *AccountService) CreateAccount(newUserData models.RestfulCreateUser) (*models.RestfulCreateUser, error) {
	// Generate master key,用于密码管理加密
	masterKey, err := passwordencrypt.GenerateMasterKey()
	if err != nil {
		return nil, err
	}

	// Generate defaultf avatar
	avatar, err := avatar.GenerateAvatar(newUserData.Email)
	if err != nil {
		return nil, err
	}

	// Generate salt
	salt := passwordencrypt.GenerateSalt()

	// password hash
	hashedPassword := passwordencrypt.HashPassword(newUserData.Password, salt)

	newUser := models.User{
		Username:  "Unknown",
		Email:     newUserData.Email,
		Password:  hashedPassword,
		Avatar:    avatar,
		Activate:  false,
		MasterKey: masterKey,
		Salt:      salt,
	}
	_, err = accountService.Repo.CreateUser(&newUser)
	if err != nil {
		return nil, err
	}
	return &models.RestfulCreateUser{
		Email:    newUser.Email,
		Password: newUser.Password,
	}, nil
}

func (accountService *AccountService) GetAccounts() ([]*models.RestfulUser, error) {
	userDatas, err := accountService.Repo.GetAllUsers()
	if err != nil {
		return nil, err
	}
	var users []*models.RestfulUser
	for _, userData := range userDatas {
		users = append(users, &models.RestfulUser{
			ID:        userData.ID.Hex(),
			Username:  userData.Username,
			Email:     userData.Email,
			Avatar:    environment.ServeURL + "/avatars/" + userData.Avatar,
			Activate:  userData.Activate,
			CreatedAt: userData.CreatedAt.Time(),
		})
	}
	return users, nil
}

func (accountService *AccountService) DeleteAccount(userID string) (*models.RestfulUser, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	userData, err := accountService.Repo.GetUserById(objectID)
	if err != nil {
		return nil, err
	}

	user := models.RestfulUser{
		ID:        userData.ID.Hex(),
		Username:  userData.Username,
		Email:     userData.Email,
		Activate:  userData.Activate,
		CreatedAt: userData.CreatedAt.Time(),
	}

	err = accountService.Repo.DeleteUser(objectID)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (accountService *AccountService) CheckEmailDuplicate(email string) (bool, error) {
	userData, err := accountService.Repo.GetUserByEmail(email)
	if err != nil {
		return false, err
	}

	if userData == nil {
		return false, nil
	}

	return true, nil
}
