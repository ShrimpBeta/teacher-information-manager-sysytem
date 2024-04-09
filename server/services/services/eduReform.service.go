package services

import (
	graphql_models "server/graph/model"
	"server/persistence/models"
	"server/persistence/repository"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type EduReformService struct {
	Repo *repository.EduReformRepo
}

func NewEduReformService(edureformRepo *repository.EduReformRepo) *EduReformService {
	return &EduReformService{Repo: edureformRepo}
}

func (eduReformService *EduReformService) CreateEduReform(userId primitive.ObjectID, newEduReformData graphql_models.EduReformData, userRepo *repository.UserRepo) (*graphql_models.EduReform, error) {
	teachersIn := make([]primitive.ObjectID, len(newEduReformData.TeachersIn)+1)
	teachersIn[0] = userId
	for i, teacher := range newEduReformData.TeachersIn {
		objectId, err := primitive.ObjectIDFromHex(*teacher)
		if err != nil {
			return nil, err
		}
		teachersIn[i+1] = objectId
	}

	newEduReform := models.EduReform{
		TeachersIn:  teachersIn,
		TeachersOut: newEduReformData.TeachersOut,
		Title:       newEduReformData.Title,
		Number:      newEduReformData.Number,
		Duration:    newEduReformData.Duration,
		Level:       newEduReformData.Level,
		Rank:        newEduReformData.Rank,
		Achievement: newEduReformData.Achievement,
		Fund:        newEduReformData.Fund,
	}

	if newEduReformData.StartDate != nil {
		startDate := primitive.NewDateTimeFromTime(*newEduReformData.StartDate)
		newEduReform.StartDate = &startDate
	}

	objectId, err := eduReformService.Repo.CreateEduReform(&newEduReform)
	if err != nil {
		return nil, err
	}

	return eduReformService.GetEduReformById(objectId.Hex(), userRepo)
}

func (eduReformService *EduReformService) UpdateEduReform(id string, edureformData graphql_models.EduReformData, userRepo *repository.UserRepo) (*graphql_models.EduReform, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	eduReformUpdate, err := eduReformService.Repo.GetEduReformById(objectId)
	if err != nil {
		return nil, err
	}

	teachersIn := make([]primitive.ObjectID, len(edureformData.TeachersIn)+1)
	teachersIn[0] = objectId
	for i, teacher := range edureformData.TeachersIn {
		objectId, err := primitive.ObjectIDFromHex(*teacher)
		if err != nil {
			return nil, err
		}
		teachersIn[i+1] = objectId
	}

	eduReformUpdate.TeachersIn = teachersIn
	eduReformUpdate.TeachersOut = edureformData.TeachersOut
	eduReformUpdate.Title = edureformData.Title
	eduReformUpdate.Number = edureformData.Number
	eduReformUpdate.Duration = edureformData.Duration
	eduReformUpdate.Level = edureformData.Level
	eduReformUpdate.Rank = edureformData.Rank
	eduReformUpdate.Achievement = edureformData.Achievement
	eduReformUpdate.Fund = edureformData.Fund

	if edureformData.StartDate == nil {
		eduReformUpdate.StartDate = nil
	} else {
		startDate := primitive.NewDateTimeFromTime(*edureformData.StartDate)
		eduReformUpdate.StartDate = &startDate
	}

	err = eduReformService.Repo.UpdateEduReform(eduReformUpdate)
	if err != nil {
		return nil, err
	}

	return eduReformService.GetEduReformById(id, userRepo)
}

func (eduReformService *EduReformService) DeleteEduReform(id string, userRepo *repository.UserRepo) (*graphql_models.EduReform, error) {

	edureformData, err := eduReformService.GetEduReformById(id, userRepo)
	if err != nil {
		return nil, err
	}

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	err = eduReformService.Repo.DeleteEduReform(objectId)
	if err != nil {
		return nil, err
	}

	return edureformData, nil
}

func (eduReformService *EduReformService) GetEduReformById(id string, userRepo *repository.UserRepo) (*graphql_models.EduReform, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	edureformData, err := eduReformService.Repo.GetEduReformById(objectId)
	if err != nil {
		return nil, err
	}

	var startDate *time.Time = nil
	if edureformData.StartDate != nil {
		date := edureformData.StartDate.Time()
		startDate = &date
	}

	usersInExport, err := userRepo.GetUsersExportByIds(edureformData.TeachersIn)
	if err != nil {
		return nil, err
	}

	return &graphql_models.EduReform{
		ID:          edureformData.ID.Hex(),
		TeachersIn:  usersInExport,
		TeachersOut: edureformData.TeachersOut,
		Title:       edureformData.Title,
		Number:      edureformData.Number,
		Duration:    edureformData.Duration,
		Level:       edureformData.Level,
		Rank:        edureformData.Rank,
		Achievement: edureformData.Achievement,
		Fund:        edureformData.Fund,
		StartDate:   startDate,
		CreatedAt:   edureformData.CreatedAt.Time(),
		UpdatedAt:   edureformData.UpdatedAt.Time(),
	}, nil
}

func (eduReformService *EduReformService) GetEduReformsByFilter(userId primitive.ObjectID, filter graphql_models.EduReformFilter, userRepo *repository.UserRepo) ([]*graphql_models.EduReform, error) {

	TeachersInID := make([]primitive.ObjectID, len(filter.TeachersIn)+1)
	TeachersInID[0] = userId
	for i, teacherIn := range filter.TeachersIn {
		objectId, err := primitive.ObjectIDFromHex(*teacherIn)
		if err != nil {
			return nil, err
		}
		TeachersInID[i+1] = objectId
	}

	edureformData, err := eduReformService.Repo.GetEduReformsByParams(
		repository.EduReformQueryParams{
			TeachersIn:     TeachersInID,
			TeachersOut:    filter.TeachersOut,
			Title:          filter.Title,
			Number:         filter.Number,
			StartDateStart: filter.StartDateStart,
			StartDateEnd:   filter.StartDateEnd,
			Level:          filter.Level,
			Rank:           filter.Rank,
			Achievement:    filter.Achievement,
			Fund:           filter.Fund,
			CreatedAtStart: filter.CreatedStart,
			CreatedAtEnd:   filter.CreatedEnd,
			UpdatedAtStart: filter.UpdatedStart,
			UpdatedAtEnd:   filter.UpdatedEnd,
		},
	)
	if err != nil {
		return nil, err
	}

	edureformExport := make([]*graphql_models.EduReform, len(edureformData))
	for i, edureform := range edureformData {
		var startDate *time.Time = nil
		if edureform.StartDate != nil {
			date := edureform.StartDate.Time()
			startDate = &date
		}

		usersInExport, err := userRepo.GetUsersExportByIds(edureform.TeachersIn)
		if err != nil {
			return nil, err
		}

		edureformExport[i] = &graphql_models.EduReform{
			ID:          edureform.ID.Hex(),
			TeachersIn:  usersInExport,
			TeachersOut: edureform.TeachersOut,
			Title:       edureform.Title,
			Number:      edureform.Number,
			Duration:    edureform.Duration,
			Level:       edureform.Level,
			Rank:        edureform.Rank,
			Achievement: edureform.Achievement,
			Fund:        edureform.Fund,
			StartDate:   startDate,
			CreatedAt:   edureform.CreatedAt.Time(),
			UpdatedAt:   edureform.UpdatedAt.Time(),
		}
	}

	return edureformExport, nil
}
