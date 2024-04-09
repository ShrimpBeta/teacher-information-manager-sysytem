package services

import (
	graphql_models "server/graph/model"
	"server/persistence/models"
	"server/persistence/repository"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UGPGGuidanceService struct {
	Repo *repository.UGPGGuidanceRepo
}

func NewUGPGGuidanceService(uGPGGuidanceRepo *repository.UGPGGuidanceRepo) *UGPGGuidanceService {
	return &UGPGGuidanceService{Repo: uGPGGuidanceRepo}
}

func (uGPGGuidanceService *UGPGGuidanceService) CreateUGPGGuidance(userId primitive.ObjectID, guidanceData graphql_models.UGPGGuidanceData) (*graphql_models.UGPGGuidance, error) {
	newUGPUGuidance := models.UGPGGuidance{
		UserId:             userId,
		StudentName:        guidanceData.StudentName,
		ThesisTopic:        guidanceData.ThesisTopic,
		OpeningCheckResult: guidanceData.OpeningCheckResult,
		MidtermCheckResult: guidanceData.MidtermCheckResult,
		DefenseResult:      guidanceData.DefenseResult,
	}

	if guidanceData.OpeningCheckDate != nil {
		openingCheckDate := primitive.NewDateTimeFromTime(*guidanceData.OpeningCheckDate)
		newUGPUGuidance.OpeningCheckDate = &openingCheckDate
	}

	if guidanceData.MidtermCheckDate != nil {
		midtermCheckDate := primitive.NewDateTimeFromTime(*guidanceData.MidtermCheckDate)
		newUGPUGuidance.MidtermCheckDate = &midtermCheckDate
	}

	if guidanceData.DefenseDate != nil {
		defenseDate := primitive.NewDateTimeFromTime(*guidanceData.DefenseDate)
		newUGPUGuidance.DefenseDate = &defenseDate
	}

	objectId, err := uGPGGuidanceService.Repo.CreateUGPGGuidance(&newUGPUGuidance)
	if err != nil {
		return nil, err
	}

	uGPGGuidanceData, err := uGPGGuidanceService.Repo.GetUGPGGuidanceById(*objectId)
	if err != nil {
		return nil, err
	}

	var openingCheckDate *time.Time = nil
	if uGPGGuidanceData.OpeningCheckDate != nil {
		date := uGPGGuidanceData.OpeningCheckDate.Time()
		openingCheckDate = &date
	}
	var midtermCheckDate *time.Time = nil
	if uGPGGuidanceData.MidtermCheckDate != nil {
		date := uGPGGuidanceData.MidtermCheckDate.Time()
		midtermCheckDate = &date
	}
	var defenseDate *time.Time = nil
	if uGPGGuidanceData.DefenseDate != nil {
		date := uGPGGuidanceData.DefenseDate.Time()
		defenseDate = &date
	}

	return &graphql_models.UGPGGuidance{
		ID:                 uGPGGuidanceData.ID.Hex(),
		StudentName:        uGPGGuidanceData.StudentName,
		ThesisTopic:        uGPGGuidanceData.ThesisTopic,
		OpeningCheckResult: uGPGGuidanceData.OpeningCheckResult,
		MidtermCheckResult: uGPGGuidanceData.MidtermCheckResult,
		DefenseResult:      uGPGGuidanceData.DefenseResult,
		OpeningCheckDate:   openingCheckDate,
		MidtermCheckDate:   midtermCheckDate,
		DefenseDate:        defenseDate,
		CreatedAt:          uGPGGuidanceData.CreatedAt.Time(),
		UpdatedAt:          uGPGGuidanceData.UpdatedAt.Time(),
	}, nil

}

func (uGPGGuidanceService *UGPGGuidanceService) UpdateUGPGGuidance(id string, uGPGGuidanceData graphql_models.UGPGGuidanceData) (*graphql_models.UGPGGuidance, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	uGPGGuidanceUpdate, err := uGPGGuidanceService.Repo.GetUGPGGuidanceById(objectId)
	if err != nil {
		return nil, err
	}

	uGPGGuidanceUpdate.StudentName = uGPGGuidanceData.StudentName
	uGPGGuidanceUpdate.ThesisTopic = uGPGGuidanceData.ThesisTopic
	uGPGGuidanceUpdate.OpeningCheckResult = uGPGGuidanceData.OpeningCheckResult
	uGPGGuidanceUpdate.MidtermCheckResult = uGPGGuidanceData.MidtermCheckResult
	uGPGGuidanceUpdate.DefenseResult = uGPGGuidanceData.DefenseResult

	if uGPGGuidanceData.OpeningCheckDate == nil {
		uGPGGuidanceUpdate.OpeningCheckDate = nil
	} else {
		openingCheckDate := primitive.NewDateTimeFromTime(*uGPGGuidanceData.OpeningCheckDate)
		uGPGGuidanceUpdate.OpeningCheckDate = &openingCheckDate
	}

	if uGPGGuidanceData.MidtermCheckDate == nil {
		uGPGGuidanceUpdate.MidtermCheckDate = nil
	} else {
		midtermCheckDate := primitive.NewDateTimeFromTime(*uGPGGuidanceData.MidtermCheckDate)
		uGPGGuidanceUpdate.MidtermCheckDate = &midtermCheckDate
	}

	if uGPGGuidanceData.DefenseDate == nil {
		uGPGGuidanceUpdate.DefenseDate = nil
	} else {
		defenseDate := primitive.NewDateTimeFromTime(*uGPGGuidanceData.DefenseDate)
		uGPGGuidanceUpdate.DefenseDate = &defenseDate
	}

	err = uGPGGuidanceService.Repo.UpdateUGPGGuidance(uGPGGuidanceUpdate)
	if err != nil {
		return nil, err
	}

	uGPGGuidanceUpdate, err = uGPGGuidanceService.Repo.GetUGPGGuidanceById(objectId)
	if err != nil {
		return nil, err
	}

	var openingCheckDate *time.Time = nil
	if uGPGGuidanceUpdate.OpeningCheckDate != nil {
		date := uGPGGuidanceUpdate.OpeningCheckDate.Time()
		openingCheckDate = &date
	}
	var midtermCheckDate *time.Time = nil
	if uGPGGuidanceUpdate.MidtermCheckDate != nil {
		date := uGPGGuidanceUpdate.MidtermCheckDate.Time()
		midtermCheckDate = &date
	}
	var defenseDate *time.Time = nil
	if uGPGGuidanceUpdate.DefenseDate != nil {
		date := uGPGGuidanceUpdate.DefenseDate.Time()
		defenseDate = &date
	}

	return &graphql_models.UGPGGuidance{
		ID:                 uGPGGuidanceUpdate.ID.Hex(),
		StudentName:        uGPGGuidanceUpdate.StudentName,
		ThesisTopic:        uGPGGuidanceUpdate.ThesisTopic,
		OpeningCheckResult: uGPGGuidanceUpdate.OpeningCheckResult,
		MidtermCheckResult: uGPGGuidanceUpdate.MidtermCheckResult,
		DefenseResult:      uGPGGuidanceUpdate.DefenseResult,
		OpeningCheckDate:   openingCheckDate,
		MidtermCheckDate:   midtermCheckDate,
		DefenseDate:        defenseDate,
		CreatedAt:          uGPGGuidanceUpdate.CreatedAt.Time(),
		UpdatedAt:          uGPGGuidanceUpdate.UpdatedAt.Time(),
	}, nil
}

func (uGPGGuidanceService *UGPGGuidanceService) DeleteUGPGGuidance(id string) (*graphql_models.UGPGGuidance, error) {

	uGPGGuidanceData, err := uGPGGuidanceService.GetUGPGGuidanceById(id)
	if err != nil {
		return nil, err
	}

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	err = uGPGGuidanceService.Repo.DeleteUGPGGuidance(objectId)
	if err != nil {
		return nil, err
	}

	return uGPGGuidanceData, nil
}

func (uGPGGuidanceService *UGPGGuidanceService) GetUGPGGuidanceById(id string) (*graphql_models.UGPGGuidance, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	uGPGGuidanceData, err := uGPGGuidanceService.Repo.GetUGPGGuidanceById(objectId)
	if err != nil {
		return nil, err
	}

	var openingCheckDate *time.Time = nil
	if uGPGGuidanceData.OpeningCheckDate != nil {
		date := uGPGGuidanceData.OpeningCheckDate.Time()
		openingCheckDate = &date
	}
	var midtermCheckDate *time.Time = nil
	if uGPGGuidanceData.MidtermCheckDate != nil {
		date := uGPGGuidanceData.MidtermCheckDate.Time()
		midtermCheckDate = &date
	}
	var defenseDate *time.Time = nil
	if uGPGGuidanceData.DefenseDate != nil {
		date := uGPGGuidanceData.DefenseDate.Time()
		defenseDate = &date
	}

	return &graphql_models.UGPGGuidance{
		ID:                 uGPGGuidanceData.ID.Hex(),
		StudentName:        uGPGGuidanceData.StudentName,
		ThesisTopic:        uGPGGuidanceData.ThesisTopic,
		OpeningCheckResult: uGPGGuidanceData.OpeningCheckResult,
		MidtermCheckResult: uGPGGuidanceData.MidtermCheckResult,
		DefenseResult:      uGPGGuidanceData.DefenseResult,
		OpeningCheckDate:   openingCheckDate,
		MidtermCheckDate:   midtermCheckDate,
		DefenseDate:        defenseDate,
		CreatedAt:          uGPGGuidanceData.CreatedAt.Time(),
		UpdatedAt:          uGPGGuidanceData.UpdatedAt.Time(),
	}, nil
}

func (uGPGGuidanceService *UGPGGuidanceService) GetUGPGGuidancesByFilter(userId primitive.ObjectID, filter graphql_models.UGPGGuidanceFilter) ([]*graphql_models.UGPGGuidance, error) {
	uGPGGuidanceData, err := uGPGGuidanceService.Repo.GetUGPGGuidancesByParams(
		repository.UGPGGuidanceQueryParams{
			UserId:           userId,
			StudentName:      filter.StudentName,
			ThesisTopic:      filter.ThesisTopic,
			DefenseDateStart: filter.DefenseDateStart,
			CreatedStart:     filter.CreatedStart,
			CreatedEnd:       filter.CreatedEnd,
			UpdatedStart:     filter.UpdatedStart,
			UpdatedEnd:       filter.UpdatedEnd,
		},
	)
	if err != nil {
		return nil, err
	}

	uGPGGuidances := make([]*graphql_models.UGPGGuidance, len(uGPGGuidanceData))
	for i, uGPGGuidance := range uGPGGuidanceData {

		var openingCheckDate *time.Time = nil
		if uGPGGuidance.OpeningCheckDate != nil {
			date := uGPGGuidance.OpeningCheckDate.Time()
			openingCheckDate = &date
		}
		var midtermCheckDate *time.Time = nil
		if uGPGGuidance.MidtermCheckDate != nil {
			date := uGPGGuidance.MidtermCheckDate.Time()
			midtermCheckDate = &date
		}
		var defenseDate *time.Time = nil
		if uGPGGuidance.DefenseDate != nil {
			date := uGPGGuidance.DefenseDate.Time()
			defenseDate = &date
		}

		uGPGGuidances[i] = &graphql_models.UGPGGuidance{
			ID:                 uGPGGuidance.ID.Hex(),
			StudentName:        uGPGGuidance.StudentName,
			ThesisTopic:        uGPGGuidance.ThesisTopic,
			OpeningCheckResult: uGPGGuidance.OpeningCheckResult,
			MidtermCheckResult: uGPGGuidance.MidtermCheckResult,
			DefenseResult:      uGPGGuidance.DefenseResult,
			OpeningCheckDate:   openingCheckDate,
			MidtermCheckDate:   midtermCheckDate,
			DefenseDate:        defenseDate,
			CreatedAt:          uGPGGuidance.CreatedAt.Time(),
			UpdatedAt:          uGPGGuidance.UpdatedAt.Time(),
		}
	}

	return uGPGGuidances, nil
}
