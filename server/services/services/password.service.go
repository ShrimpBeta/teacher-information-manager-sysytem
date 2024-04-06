package services

import (
	graphql_models "server/graph/model"
	"server/persistence/models"
	"server/persistence/repository"
	passwordencrypt "server/services/passwordEncrypt"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PasswordService struct {
	Repo *repository.PasswordRepo
}

func NewPasswordService(passwordRepo *repository.PasswordRepo) *PasswordService {
	return &PasswordService{Repo: passwordRepo}
}

func (passwordService *PasswordService) CreatePassword(userID primitive.ObjectID, masterKey string, newPasswordData graphql_models.PasswordData) (*graphql_models.Password, error) {
	passwordEncrypt, err := passwordencrypt.Encrypt(masterKey, newPasswordData.Password)
	if err != nil {
		return nil, err
	}

	newPassword := models.Password{
		Url:         newPasswordData.URL,
		UserId:      userID,
		Account:     newPasswordData.Account,
		AppName:     newPasswordData.AppName,
		Password:    passwordEncrypt,
		Description: newPasswordData.Description,
	}
	objectId, err := passwordService.Repo.CreatePassword(&newPassword)
	if err != nil {
		return nil, err
	}

	passwordData, err := passwordService.Repo.GetPasswordById(*objectId)
	if err != nil {
		return nil, err
	}

	return &graphql_models.Password{
		ID:          passwordData.ID.Hex(),
		URL:         passwordData.Url,
		Account:     passwordData.Account,
		AppName:     passwordData.AppName,
		Description: passwordData.Description,
		CreatedAt:   passwordData.CreatedAt.Time(),
		UpdatedAt:   passwordData.UpdatedAt.Time(),
	}, nil
}

func (passwordService *PasswordService) UpdatePassword(id string, userId primitive.ObjectID, masterKey string, passwordData graphql_models.PasswordData) (*graphql_models.Password, error) {

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	passwordEncrypt, err := passwordencrypt.Encrypt(masterKey, passwordData.Password)

	passwordUpdate := &models.Password{
		ID:          objectId,
		Url:         passwordData.URL,
		AppName:     passwordData.AppName,
		Account:     passwordData.Account,
		Password:    passwordEncrypt,
		Description: passwordData.Description,
	}

	err = passwordService.Repo.UpdatePassword(passwordUpdate)
	if err != nil {
		return nil, err
	}

	passwordUpdate, err = passwordService.Repo.GetPasswordById(objectId)
	if err != nil {
		return nil, err
	}
	return &graphql_models.Password{
		ID:          passwordUpdate.ID.Hex(),
		URL:         passwordUpdate.Url,
		Account:     passwordUpdate.Account,
		AppName:     passwordUpdate.AppName,
		Description: passwordUpdate.Description,
		CreatedAt:   passwordUpdate.CreatedAt.Time(),
		UpdatedAt:   passwordUpdate.UpdatedAt.Time(),
	}, nil
}

func (passwordService *PasswordService) DeletePassword(id string) (*graphql_models.Password, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	passwordData, err := passwordService.Repo.GetPasswordById(objectId)
	if err != nil {
		return nil, err
	}
	err = passwordService.Repo.DeletePassword(objectId)
	if err != nil {
		return nil, err
	}
	return &graphql_models.Password{
		ID:          passwordData.ID.Hex(),
		URL:         passwordData.Url,
		Account:     passwordData.Account,
		AppName:     passwordData.AppName,
		Description: passwordData.Description,
		CreatedAt:   passwordData.CreatedAt.Time(),
		UpdatedAt:   passwordData.UpdatedAt.Time(),
	}, nil
}

func (passwordService *PasswordService) GetPasswordById(id string) (*graphql_models.PasswordTrue, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	passwordData, err := passwordService.Repo.GetPasswordById(objectId)
	if err != nil {
		return nil, err
	}
	return &graphql_models.PasswordTrue{
		ID:          passwordData.ID.Hex(),
		URL:         passwordData.Url,
		Account:     passwordData.Account,
		AppName:     passwordData.AppName,
		Password:    passwordData.Password,
		Description: passwordData.Description,
		CreatedAt:   passwordData.CreatedAt.Time(),
		UpdatedAt:   passwordData.UpdatedAt.Time(),
	}, nil
}

func (passwordService *PasswordService) GetPasswordsByFilter(filter graphql_models.PasswordFilter) ([]*graphql_models.Password, error) {
	userObjectId, err := primitive.ObjectIDFromHex(filter.UserID)
	if err != nil {
		return nil, err
	}
	passwordsData, err := passwordService.Repo.GetPasswordsByParams(
		repository.PasswordQueryParams{
			UserId:  userObjectId,
			Url:     filter.URL,
			AppName: filter.AppName,
			Account: filter.Account,
		},
	)
	if err != nil {
		return nil, err
	}
	passwords := make([]*graphql_models.Password, len(passwordsData))
	for i, passwordData := range passwordsData {
		passwords[i] = &graphql_models.Password{
			ID:          passwordData.ID.Hex(),
			URL:         passwordData.Url,
			Account:     passwordData.Account,
			AppName:     passwordData.AppName,
			Description: passwordData.Description,
			CreatedAt:   passwordData.CreatedAt.Time(),
			UpdatedAt:   passwordData.UpdatedAt.Time(),
		}
	}
	return passwords, nil
}
