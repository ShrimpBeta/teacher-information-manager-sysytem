package services

import (
	graphql_models "server/graph/model"
	"server/persistence/models"
	"server/persistence/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CompGuidanceService struct {
	Repo *repository.CompGuidanceRepo
}

func NewCompGuidanceService(compguidanceRepo *repository.CompGuidanceRepo) *CompGuidanceService {
	return &CompGuidanceService{Repo: compguidanceRepo}
}

func (compGuidanceService *CompGuidanceService) CreateCompGuidance(userId primitive.ObjectID, newGuidanceData graphql_models.CompGuidanceData) (*graphql_models.CompGuidance, error) {
	guidanceDate := primitive.NewDateTimeFromTime(*newGuidanceData.GuidanceDate)

	newCompGuidance := models.CompGuidance{
		UserId:           userId,
		ProjectName:      newGuidanceData.ProjectName,
		StudentNames:     newGuidanceData.StudentNames,
		CompetitionScore: newGuidanceData.CompetitionScore,
		GuidanceDate:     &guidanceDate,
		AwardStatus:      newGuidanceData.AwardStatus,
	}
	objectId, err := compGuidanceService.Repo.CratedCompGuidance(&newCompGuidance)
	if err != nil {
		return nil, err
	}
	comGuidanceData, err := compGuidanceService.Repo.GetCompGuidanceById(*objectId)
	if err != nil {
		return nil, err
	}

	createdGuidanceDate := comGuidanceData.GuidanceDate.Time()
	return &graphql_models.CompGuidance{
		ID:               comGuidanceData.ID.Hex(),
		ProjectName:      comGuidanceData.ProjectName,
		StudentNames:     newGuidanceData.StudentNames,
		CompetitionScore: comGuidanceData.CompetitionScore,
		GuidanceDate:     &createdGuidanceDate,
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

	guidanceDate := compGuidanceUpdate.GuidanceDate.Time()
	return &graphql_models.CompGuidance{
		ID:               compGuidanceUpdate.ID.Hex(),
		ProjectName:      compGuidanceUpdate.ProjectName,
		StudentNames:     compGuidanceUpdate.StudentNames,
		CompetitionScore: compGuidanceUpdate.CompetitionScore,
		GuidanceDate:     &guidanceDate,
		AwardStatus:      compGuidanceUpdate.AwardStatus,
		CreatedAt:        compGuidanceUpdate.CreatedAt.Time(),
		UpdatedAt:        compGuidanceUpdate.UpdatedAt.Time(),
	}, nil
}

func (compGuidanceService *CompGuidanceService) DeleteCompGuidance(id string) (*graphql_models.CompGuidance, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	compGuidanceData, err := compGuidanceService.Repo.GetCompGuidanceById(objectId)
	if err != nil {
		return nil, err
	}

	err = compGuidanceService.Repo.DeleteCompGuidance(objectId)
	if err != nil {
		return nil, err
	}

	guidanceDate := compGuidanceData.GuidanceDate.Time()
	return &graphql_models.CompGuidance{
		ID:               compGuidanceData.ID.Hex(),
		ProjectName:      compGuidanceData.ProjectName,
		StudentNames:     compGuidanceData.StudentNames,
		CompetitionScore: compGuidanceData.CompetitionScore,
		GuidanceDate:     &guidanceDate,
		AwardStatus:      compGuidanceData.AwardStatus,
		CreatedAt:        compGuidanceData.CreatedAt.Time(),
		UpdatedAt:        compGuidanceData.UpdatedAt.Time(),
	}, nil
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

	guidanceDate := compGuidanceData.GuidanceDate.Time()
	return &graphql_models.CompGuidance{
		ID:               compGuidanceData.ID.Hex(),
		ProjectName:      compGuidanceData.ProjectName,
		StudentNames:     compGuidanceData.StudentNames,
		CompetitionScore: compGuidanceData.CompetitionScore,
		GuidanceDate:     &guidanceDate,
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

		guidanceDate := compGuidanceData.GuidanceDate.Time()
		compGuidances[i] = &graphql_models.CompGuidance{
			ID:               compGuidanceData.ID.Hex(),
			ProjectName:      compGuidanceData.ProjectName,
			StudentNames:     compGuidanceData.StudentNames,
			CompetitionScore: compGuidanceData.CompetitionScore,
			GuidanceDate:     &guidanceDate,
			AwardStatus:      compGuidanceData.AwardStatus,
			CreatedAt:        compGuidanceData.CreatedAt.Time(),
			UpdatedAt:        compGuidanceData.UpdatedAt.Time(),
		}
	}
	return compGuidances, nil
}
