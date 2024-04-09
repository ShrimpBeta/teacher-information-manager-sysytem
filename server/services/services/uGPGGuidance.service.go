package services

import (
	graphql_models "server/graph/model"
	"server/persistence/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UGPGGuidanceService struct {
	Repo *repository.UGPGGuidanceRepo
}

func NewUGPGGuidanceService(uGPGGuidanceRepo *repository.UGPGGuidanceRepo) *UGPGGuidanceService {
	return &UGPGGuidanceService{Repo: uGPGGuidanceRepo}
}

func (uGPGGuidanceService *UGPGGuidanceService) CreateUGPGGuidance(userId primitive.ObjectID, guidanceData graphql_models.UGPGGuidanceData) (*graphql_models.UGPGGuidance, error) {
	panic("not implemented")

}

func (uGPGGuidanceService *UGPGGuidanceService) UpdateUGPGGuidance(id string, uGPGGuidanceData graphql_models.UGPGGuidanceData) (*graphql_models.UGPGGuidance, error) {
	panic("not implemented")
}

func (uGPGGuidanceService *UGPGGuidanceService) DeleteUGPGGuidance(id string) (*graphql_models.UGPGGuidance, error) {
	panic("not implemented")
}

func (uGPGGuidanceService *UGPGGuidanceService) GetUGPGGuidanceById(id string) (*graphql_models.UGPGGuidance, error) {
	panic("not implemented")
}

func (uGPGGuidanceService *UGPGGuidanceService) GetUGPGGuidancesByFilter(userId primitive.ObjectID, filter graphql_models.UGPGGuidanceFilter) ([]*graphql_models.UGPGGuidance, error) {
	panic("not implemented")
}
