package services

import (
	"errors"
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

	return passwordService.GetPasswordById(objectId.Hex())
}

func (passwordService *PasswordService) UpdatePassword(id string, masterKey string, passwordData graphql_models.PasswordData) (*graphql_models.Password, error) {

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	passwordUpdate, err := passwordService.Repo.GetPasswordById(objectId)
	if err != nil {
		return nil, err
	}

	passwordEncrypt, err := passwordencrypt.Encrypt(masterKey, passwordData.Password)
	if err != nil {
		return nil, err
	}

	passwordUpdate.Account = passwordData.Account
	passwordUpdate.Password = passwordEncrypt
	passwordUpdate.Url = passwordData.URL
	passwordUpdate.AppName = passwordData.AppName
	passwordUpdate.Description = passwordData.Description

	err = passwordService.Repo.UpdatePassword(passwordUpdate)
	if err != nil {
		return nil, err
	}

	return passwordService.GetPasswordById(id)
}

func (passwordService *PasswordService) DeletePassword(id string) (*graphql_models.Password, error) {

	passwordData, err := passwordService.GetPasswordById(id)
	if err != nil {
		return nil, err
	}

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	err = passwordService.Repo.DeletePassword(objectId)
	if err != nil {
		return nil, err
	}

	return passwordData, nil
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
		Description: passwordData.Description,
		CreatedAt:   passwordData.CreatedAt.Time(),
		UpdatedAt:   passwordData.UpdatedAt.Time(),
	}, nil
}

func (passwordService *PasswordService) GetPasswordTrueById(id, masterKey string) (*graphql_models.PasswordTrue, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	passwordData, err := passwordService.Repo.GetPasswordById(objectId)
	if err != nil {
		return nil, err
	}

	passwordDecrypt, err := passwordencrypt.Decrypt(masterKey, passwordData.Password)
	if err != nil {
		return nil, err
	}

	return &graphql_models.PasswordTrue{
		ID:          passwordData.ID.Hex(),
		URL:         passwordData.Url,
		Account:     passwordData.Account,
		AppName:     passwordData.AppName,
		Password:    passwordDecrypt,
		Description: passwordData.Description,
		CreatedAt:   passwordData.CreatedAt.Time(),
		UpdatedAt:   passwordData.UpdatedAt.Time(),
	}, nil
}

func (passwordService *PasswordService) GetPasswordsByFilter(userId primitive.ObjectID, filter graphql_models.PasswordFilter, offset int, limit int) (*graphql_models.PasswordsQuery, error) {
	passwordsData, err := passwordService.Repo.GetPasswordsByParams(
		repository.PasswordQueryParams{
			UserId:  userId,
			Url:     filter.URL,
			AppName: filter.AppName,
			Account: filter.Account,
		},
	)
	if err != nil {
		return nil, err
	}

	// passwords := make([]*graphql_models.Password, len(passwordsData))
	// for i, passwordData := range passwordsData {
	// 	passwords[i] = &graphql_models.Password{
	// 		ID:          passwordData.ID.Hex(),
	// 		URL:         passwordData.Url,
	// 		Account:     passwordData.Account,
	// 		AppName:     passwordData.AppName,
	// 		Description: passwordData.Description,
	// 		CreatedAt:   passwordData.CreatedAt.Time(),
	// 		UpdatedAt:   passwordData.UpdatedAt.Time(),
	// 	}
	// }

	if len(passwordsData) == 0 {
		return &graphql_models.PasswordsQuery{
			TotalCount: 0,
			Passwords:  []*graphql_models.Password{},
		}, nil
	}

	if offset >= len(passwordsData) || offset < 0 {
		return nil, errors.New("offset out of range")
	}

	if limit <= 0 {
		return nil, errors.New("limit must be greater than 0")
	}

	if limit+offset > len(passwordsData) {
		limit = len(passwordsData) - offset
	}

	passwords := make([]*graphql_models.Password, limit)
	for i := 0; i < limit; i++ {
		passwordData := passwordsData[offset+i]
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

	return &graphql_models.PasswordsQuery{
		TotalCount: len(passwordsData),
		Passwords:  passwords,
	}, nil
}

func (passwordService *PasswordService) GetPasswordsByIds(ids []*string, masterKey string) ([]*graphql_models.PasswordTrue, error) {
	objectIds := make([]primitive.ObjectID, len(ids))
	for _, id := range ids {
		objectId, err := primitive.ObjectIDFromHex(*id)
		if err != nil {
			return nil, err
		}
		objectIds = append(objectIds, objectId)
	}

	passwordsData, err := passwordService.Repo.GetPasswordsByIds(objectIds)
	if err != nil {
		return nil, err
	}

	passwords := make([]*graphql_models.PasswordTrue, len(passwordsData))
	for i, passwordData := range passwordsData {
		passwordDecrypt, err := passwordencrypt.Decrypt(masterKey, passwordData.Password)
		if err != nil {
			return nil, err
		}
		passwords[i] = &graphql_models.PasswordTrue{
			ID:          passwordData.ID.Hex(),
			URL:         passwordData.Url,
			Account:     passwordData.Account,
			AppName:     passwordData.AppName,
			Password:    passwordDecrypt,
			Description: passwordData.Description,
			CreatedAt:   passwordData.CreatedAt.Time(),
			UpdatedAt:   passwordData.UpdatedAt.Time(),
		}
	}

	return passwords, nil
}
