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

func NewAccountService(r *repository.UserRepo) *AccountService {
	return &AccountService{Repo: r}
}

func (a *AccountService) CreateAccount(newUserData models.RestfulCreateUser) (*models.RestfulCreateUser, error) {
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
	_, err = a.Repo.CreateUser(&newUser)
	if err != nil {
		return nil, err
	}
	return &models.RestfulCreateUser{
		Email:    newUser.Email,
		Password: newUser.Password,
	}, nil
}

func (a *AccountService) GetAccounts() ([]*models.RestfulUser, error) {
	userDatas, err := a.Repo.GetAllUsers()
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

func (a *AccountService) DeleteAccount(userID string) (*models.RestfulUser, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	userData, err := a.Repo.GetUserById(objectID)
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

	err = a.Repo.DeleteUser(objectID)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (a *AccountService) CheckEmailDuplicate(email string) (bool, error) {
	uerId, err := a.Repo.GetUserIdByEmail(email)
	if err != nil {
		return false, err
	}

	if uerId == nil {
		return false, nil
	}

	return true, nil
}
