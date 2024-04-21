package services

import (
	"errors"
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

	return compGuidanceService.GetCompGuidanceById(userId, objectId.Hex())
}

func (compGuidanceService *CompGuidanceService) UpdateCompGuidance(userId primitive.ObjectID, id string, compGuidanceData graphql_models.CompGuidanceData) (*graphql_models.CompGuidance, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	compGuidanceUpdate, err := compGuidanceService.Repo.GetCompGuidanceById(objectId)
	if err != nil {
		return nil, err
	}

	if compGuidanceUpdate.UserId != userId {
		return nil, errors.New("the document not accessable for the user")
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

	return compGuidanceService.GetCompGuidanceById(userId, id)
}

func (compGuidanceService *CompGuidanceService) DeleteCompGuidance(userId primitive.ObjectID, id string) (*graphql_models.CompGuidance, error) {

	compGuidanceData, err := compGuidanceService.GetCompGuidanceById(userId, id)
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

func (compGuidanceService *CompGuidanceService) GetCompGuidanceById(userId primitive.ObjectID, id string) (*graphql_models.CompGuidance, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	compGuidanceData, err := compGuidanceService.Repo.GetCompGuidanceById(objectId)
	if err != nil {
		return nil, err
	}

	if compGuidanceData.UserId != userId {
		return nil, errors.New("the document not accessable for the user")
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

func (compGuidanceService *CompGuidanceService) GetCompGuidancesByFilter(userId primitive.ObjectID, filter graphql_models.CompGuidanceFilter, offset int, limit int) (*graphql_models.CompGuidanceQuery, error) {
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

	// compGuidances := make([]*graphql_models.CompGuidance, len(compGuidancesData))
	// for i, compGuidanceData := range compGuidancesData {
	// 	var guidanceDate *time.Time = nil
	// 	if compGuidanceData.GuidanceDate != nil {
	// 		date := compGuidanceData.GuidanceDate.Time()
	// 		guidanceDate = &date
	// 	}
	// 	compGuidances[i] = &graphql_models.CompGuidance{
	// 		ID:               compGuidanceData.ID.Hex(),
	// 		ProjectName:      compGuidanceData.ProjectName,
	// 		StudentNames:     compGuidanceData.StudentNames,
	// 		CompetitionScore: compGuidanceData.CompetitionScore,
	// 		GuidanceDate:     guidanceDate,
	// 		AwardStatus:      compGuidanceData.AwardStatus,
	// 		CreatedAt:        compGuidanceData.CreatedAt.Time(),
	// 		UpdatedAt:        compGuidanceData.UpdatedAt.Time(),
	// 	}
	// }

	if len(compGuidancesData) == 0 {
		return &graphql_models.CompGuidanceQuery{
			TotalCount:    0,
			CompGuidances: []*graphql_models.CompGuidance{},
		}, nil
	}

	if offset >= len(compGuidancesData) || offset < 0 {
		return nil, errors.New("offset out of range")
	}

	if limit <= 0 {
		return nil, errors.New("limit must be greater than 0")
	}

	if limit+offset > len(compGuidancesData) {
		limit = len(compGuidancesData) - offset
	}

	compGuidances := make([]*graphql_models.CompGuidance, limit)
	for i := 0; i < limit; i++ {
		compGuidanceData := compGuidancesData[i+offset]
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

	return &graphql_models.CompGuidanceQuery{
		TotalCount:    len(compGuidancesData),
		CompGuidances: compGuidances,
	}, nil
}
