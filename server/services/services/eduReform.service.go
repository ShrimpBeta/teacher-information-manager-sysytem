package services

import (
	graphql_models "server/graph/model"
	"server/persistence/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type EduReformService struct {
	Repo *repository.EduReformRepo
}

func NewEduReformService(edureformRepo *repository.EduReformRepo) *EduReformService {
	return &EduReformService{Repo: edureformRepo}
}

func (edureformService *EduReformService) CreateEduReform(userId primitive.ObjectID, edureformData graphql_models.EduReformData, userRepo *repository.UserRepo) (*graphql_models.EduReform, error) {
	panic("not implemented")

}

func (edureformService *EduReformService) UpdateEduReform(id string, edureformData graphql_models.EduReformData, userRepo *repository.UserRepo) (*graphql_models.EduReform, error) {
	panic("not implemented")
}

func (edureformService *EduReformService) DeleteEduReform(id string, userRepo *repository.UserRepo) (*graphql_models.EduReform, error) {
	panic("not implemented")
}

func (edureformService *EduReformService) GetEduReformById(id string, userRepo *repository.UserRepo) (*graphql_models.EduReform, error) {
	panic("not implemented")
}

func (edureformService *EduReformService) GetEduReformsByFilter(userId primitive.ObjectID, filter graphql_models.EduReformFilter, userRepo *repository.UserRepo) ([]*graphql_models.EduReform, error) {
	panic("not implemented")
}
