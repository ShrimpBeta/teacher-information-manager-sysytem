package services

import (
	graphql_models "server/graph/model"
	"server/persistence/models"
	"server/persistence/repository"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CompGuidanceService struct {
	Repo *repository.CompGuidanceRepo
}

func NewCompGuidanceService(compguidanceRepo *repository.CompGuidanceRepo) *CompGuidanceService {
	return &CompGuidanceService{Repo: compguidanceRepo}
}

func (compGuidanceService *CompGuidanceService) CreateCompGuidance(userId primitive.ObjectID, newGuidanceData graphql_models.CompGuidanceData) (*graphql_models.CompGuidance, error) {

	newCompGuidance := models.CompGuidance{
		UserId:           userId,
		ProjectName:      newGuidanceData.ProjectName,
		StudentNames:     newGuidanceData.StudentNames,
		CompetitionScore: newGuidanceData.CompetitionScore,
		AwardStatus:      newGuidanceData.AwardStatus,
	}

	if newGuidanceData.GuidanceDate != nil {
		guidanceDate := primitive.NewDateTimeFromTime(*newGuidanceData.GuidanceDate)
		newCompGuidance.GuidanceDate = &guidanceDate
	}

	objectId, err := compGuidanceService.Repo.CratedCompGuidance(&newCompGuidance)
	if err != nil {
		return nil, err
	}
	comGuidanceData, err := compGuidanceService.Repo.GetCompGuidanceById(*objectId)
	if err != nil {
		return nil, err
	}

	var guidanceDate *time.Time = nil
	if comGuidanceData.GuidanceDate != nil {
		date := comGuidanceData.GuidanceDate.Time()
		guidanceDate = &date
	}

	return &graphql_models.CompGuidance{
		ID:               comGuidanceData.ID.Hex(),
		ProjectName:      comGuidanceData.ProjectName,
		StudentNames:     newGuidanceData.StudentNames,
		CompetitionScore: comGuidanceData.CompetitionScore,
		GuidanceDate:     guidanceDate,
		AwardStatus:      comGuidanceData.AwardStatus,
		CreatedAt:        comGuidanceData.CreatedAt.Time(),
		UpdatedAt:        comGuidanceData.UpdatedAt.Time(),
	}, nil
}

func (compGuidanceService *CompGuidanceService) UpdateCompGuidance(id string, compGuidanceData graphql_models.CompGuidanceData) (*graphql_models.CompGuidance, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	compGuidanceUpdate, err := compGuidanceService.Repo.GetCompGuidanceById(objectId)
	if err != nil {
		return nil, err
	}

	compGuidanceUpdate.ProjectName = compGuidanceData.ProjectName
	compGuidanceUpdate.StudentNames = compGuidanceData.StudentNames
	compGuidanceUpdate.CompetitionScore = compGuidanceData.CompetitionScore
	compGuidanceUpdate.AwardStatus = compGuidanceData.AwardStatus

	if compGuidanceData.GuidanceDate == nil {
		compGuidanceUpdate.GuidanceDate = nil
	} else {
		guidanceDate := primitive.NewDateTimeFromTime(*compGuidanceData.GuidanceDate)
		compGuidanceUpdate.GuidanceDate = &guidanceDate
	}

	err = compGuidanceService.Repo.UpdateCompGuidance(compGuidanceUpdate)
	if err != nil {
		return nil, err
	}

	compGuidanceUpdate, err = compGuidanceService.Repo.GetCompGuidanceById(objectId)
	if err != nil {
		return nil, err
	}

	var guidanceDate *time.Time = nil
	if compGuidanceUpdate.GuidanceDate != nil {
		date := compGuidanceUpdate.GuidanceDate.Time()
		guidanceDate = &date
	}

	return &graphql_models.CompGuidance{
		ID:               compGuidanceUpdate.ID.Hex(),
		ProjectName:      compGuidanceUpdate.ProjectName,
		StudentNames:     compGuidanceUpdate.StudentNames,
		CompetitionScore: compGuidanceUpdate.CompetitionScore,
		GuidanceDate:     guidanceDate,
		AwardStatus:      compGuidanceUpdate.AwardStatus,
		CreatedAt:        compGuidanceUpdate.CreatedAt.Time(),
		UpdatedAt:        compGuidanceUpdate.UpdatedAt.Time(),
	}, nil
}

func (compGuidanceService *CompGuidanceService) DeleteCompGuidance(id string) (*graphql_models.CompGuidance, error) {

	compGuidanceData, err := compGuidanceService.GetCompGuidanceById(id)
	if err != nil {
		return nil, err
	}

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	err = compGuidanceService.Repo.DeleteCompGuidance(objectId)
	if err != nil {
		return nil, err
	}

	return compGuidanceData, nil
}

func (compGuidanceService *CompGuidanceService) GetCompGuidanceById(id string) (*graphql_models.CompGuidance, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	compGuidanceData, err := compGuidanceService.Repo.GetCompGuidanceById(objectId)
	if err != nil {
		return nil, err
	}

	var guidanceDate *time.Time = nil
	if compGuidanceData.GuidanceDate != nil {
		date := compGuidanceData.GuidanceDate.Time()
		guidanceDate = &date
	}

	return &graphql_models.CompGuidance{
		ID:               compGuidanceData.ID.Hex(),
		ProjectName:      compGuidanceData.ProjectName,
		StudentNames:     compGuidanceData.StudentNames,
		CompetitionScore: compGuidanceData.CompetitionScore,
		GuidanceDate:     guidanceDate,
		AwardStatus:      compGuidanceData.AwardStatus,
		CreatedAt:        compGuidanceData.CreatedAt.Time(),
		UpdatedAt:        compGuidanceData.UpdatedAt.Time(),
	}, nil
}

func (compGuidanceService *CompGuidanceService) GetCompGuidancesByFilter(userId primitive.ObjectID, filter graphql_models.CompGuidanceFilter) ([]*graphql_models.CompGuidance, error) {
	compGuidancesData, err := compGuidanceService.Repo.GetCompGuidancesByParams(
		repository.CompGuidanceQueryParams{
			UserId:            userId,
			ProjectName:       filter.ProjectName,
			StudentNames:      filter.StudentNames,
			GuidanceDateStart: filter.GuidanceDateStart,
			GuidanceDateEnd:   filter.GuidanceDateEnd,
			AwardStatus:       filter.AwardStatus,
			CreatedStart:      filter.CreatedStart,
			CreatedEnd:        filter.CreatedEnd,
			UpdatedStart:      filter.UpdatedStart,
			UpdatedEnd:        filter.UpdatedEnd,
		})
	if err != nil {
		return nil, err
	}
	compGuidances := make([]*graphql_models.CompGuidance, len(compGuidancesData))
	for i, compGuidanceData := range compGuidancesData {
		var guidanceDate *time.Time = nil
		if compGuidanceData.GuidanceDate != nil {
			date := compGuidanceData.GuidanceDate.Time()
			guidanceDate = &date
		}
		compGuidances[i] = &graphql_models.CompGuidance{
			ID:               compGuidanceData.ID.Hex(),
			ProjectName:      compGuidanceData.ProjectName,
			StudentNames:     compGuidanceData.StudentNames,
			CompetitionScore: compGuidanceData.CompetitionScore,
			GuidanceDate:     guidanceDate,
			AwardStatus:      compGuidanceData.AwardStatus,
			CreatedAt:        compGuidanceData.CreatedAt.Time(),
			UpdatedAt:        compGuidanceData.UpdatedAt.Time(),
		}
	}
	return compGuidances, nil
}
