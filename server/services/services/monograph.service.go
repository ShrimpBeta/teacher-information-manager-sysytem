package services

import (
	graphql_models "server/graph/model"
	"server/persistence/repository"

	"github.com/99designs/gqlgen/graphql"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MonographService struct {
	Repo *repository.MonographRepo
}

func NewMonographService(monographRepo *repository.MonographRepo) *MonographService {
	return &MonographService{Repo: monographRepo}
}

func (monographService *MonographService) CreateMonograph(userId primitive.ObjectID, monographData graphql_models.MonographData, userRepo *repository.UserRepo) (*graphql_models.Monograph, error) {
	panic("not implemented")
}

func (monographService *MonographService) UpdateMonograph(id string, monographData graphql_models.MonographData, userRepo *repository.UserRepo) (*graphql_models.Monograph, error) {
	panic("not implemented")
}

func (monographService *MonographService) DeleteMonograph(id string, userRepo *repository.UserRepo) (*graphql_models.Monograph, error) {
	panic("not implemented")
}

func (monographService *MonographService) GetMonographById(id string, userRepo *repository.UserRepo) (*graphql_models.Monograph, error) {
	panic("not implemented")
}

func (monographService *MonographService) GetMonographsByFilter(userId primitive.ObjectID, filter graphql_models.MonographFilter, userRepo *repository.UserRepo) ([]*graphql_models.Monograph, error) {
	panic("not implemented")
}

func (monographService *MonographService) UploadMonographs(file graphql.Upload, userRepo *repository.UserRepo) ([]*graphql_models.MonographPreview, error) {
	panic("not implemented")
}
