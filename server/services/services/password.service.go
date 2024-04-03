package services

import (
	graphql_models "server/graph/model"
	"server/persistence/models"
	"server/persistence/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PasswordService struct {
	Repo *repository.PasswordRepo
}

func NewPasswordService(passwordRepo *repository.PasswordRepo) *PasswordService {
	return &PasswordService{Repo: passwordRepo}
}

func (passwordService *PasswordService) CreatePassword(userID string, newPasswordData graphql_models.PasswordData) (*graphql_models.Password, error) {
	userObjectId, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	newPassword := models.Password{
		Url:         newPasswordData.URL,
		UserId:      userObjectId,
		Account:     newPasswordData.Account,
		AppName:     newPasswordData.AppName,
		Password:    newPasswordData.Password,
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
		Password:    passwordData.Password,
		Description: passwordData.Description,
		CreatedAt:   passwordData.CreatedAt.Time(),
		UpdatedAt:   passwordData.UpdatedAt.Time(),
	}, nil
}

func (passwordService *PasswordService) UpdatePassword(id string, passwordData graphql_models.PasswordData) (*graphql_models.Password, error) {

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	passwordUpdate := &models.Password{
		ID:          objectId,
		Url:         passwordData.URL,
		AppName:     passwordData.AppName,
		Account:     passwordData.Account,
		Password:    passwordData.Password,
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
		Password:    passwordUpdate.Password,
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
		Password:    passwordData.Password,
		Description: passwordData.Description,
		CreatedAt:   passwordData.CreatedAt.Time(),
		UpdatedAt:   passwordData.UpdatedAt.Time(),
	}, nil
}

func (passwordService *PasswordService) GetPasswordById(id string) (*graphql_models.Password, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	passwordData, err := passwordService.Repo.GetPasswordById(objectId)
	if err != nil {
		return nil, err
	}
	return &graphql_models.Password{
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

func (passwordService *PasswordService) GetPasswordsByUserId(userID string) ([]*graphql_models.Password, error) {
	userObjectId, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	passwordsData, err := passwordService.Repo.GetPasswordsByParams(repository.PasswordQueryParams{UserId: userObjectId})
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
			Password:    passwordData.Password,
			Description: passwordData.Description,
			CreatedAt:   passwordData.CreatedAt.Time(),
			UpdatedAt:   passwordData.UpdatedAt.Time(),
		}
	}
	return passwords, nil
}
