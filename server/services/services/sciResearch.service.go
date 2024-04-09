package services

import (
	"fmt"
	graphql_models "server/graph/model"
	"server/persistence/repository"

	"github.com/99designs/gqlgen/graphql"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SciResearchService struct {
	Repo *repository.SciResearchRepo
}

func NewSciResearchService(sciResearchRepo *repository.SciResearchRepo, userRepo *repository.UserRepo) *SciResearchService {
	return &SciResearchService{Repo: sciResearchRepo}
}

func (s *SciResearchService) CreateSciResearch(userID primitive.ObjectID, sciResearchData graphql_models.SciResearchData, userRepo *repository.UserRepo) (*graphql_models.SciResearch, error) {
	panic(fmt.Errorf("not implemented: CreateSciResearch - createSciResearch"))
}

func (s *SciResearchService) UpdateSciResearch(sciResearchID string, sciResearchData graphql_models.SciResearchData, userRepo *repository.UserRepo) (*graphql_models.SciResearch, error) {
	panic(fmt.Errorf("not implemented: UpdateSciResearch - updateSciResearch"))
}

func (s *SciResearchService) DeleteSciResearch(sciResearchID string, userRepo *repository.UserRepo) (*graphql_models.SciResearch, error) {
	panic(fmt.Errorf("not implemented: DeleteSciResearch - deleteSciResearch"))
}

func (s *SciResearchService) GetSciResearchById(sciResearchID string, userRepo *repository.UserRepo) (*graphql_models.SciResearch, error) {
	panic(fmt.Errorf("not implemented: GetSciResearchById - getSciResearchById"))
}

func (s *SciResearchService) GetSciResearchsByFilter(userId primitive.ObjectID, filter graphql_models.SciResearchFilter, userRepo *repository.UserRepo) ([]*graphql_models.SciResearch, error) {
	panic(fmt.Errorf("not implemented: GetSciResearchs - getSciResearchs"))
}

func (s *SciResearchService) UploadSciResearchs(file graphql.Upload, userRepo *repository.UserRepo) (*graphql_models.SciResearchPreview, error) {
	panic(fmt.Errorf("not implemented: UploadSciResearchs - uploadSciResearchs"))
}
