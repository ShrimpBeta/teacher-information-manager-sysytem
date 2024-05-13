package services

import (
	"errors"
	graphql_models "server/graph/model"
	"server/persistence/models"
	"server/persistence/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MonographService struct {
	Repo *repository.MonographRepo
}

func NewMonographService(monographRepo *repository.MonographRepo) *MonographService {
	return &MonographService{Repo: monographRepo}
}

func (monographService *MonographService) CreateMonograph(userId primitive.ObjectID, newMonographData graphql_models.MonographData, userRepo *repository.UserRepo) (*graphql_models.Monograph, error) {
	teachersIn := make([]primitive.ObjectID, len(newMonographData.TeachersIn)+1)
	teachersIn[0] = userId
	for i, teacher := range newMonographData.TeachersIn {
		objectId, err := primitive.ObjectIDFromHex(*teacher)
		if err != nil {
			return nil, err
		}
		teachersIn[i+1] = objectId
	}

	newMonograph := models.Monograph{
		TeachersIn:   teachersIn,
		TeachersOut:  newMonographData.TeachersOut,
		Title:        newMonographData.Title,
		PublishLevel: newMonographData.PublishLevel,
		Rank:         newMonographData.Rank,
		PublishDate:  primitive.NewDateTimeFromTime(newMonographData.PublishDate),
	}

	objectId, err := monographService.Repo.CreateMonograph(&newMonograph)
	if err != nil {
		return nil, err
	}

	return monographService.GetMonographById(userId, objectId.Hex(), userRepo)
}

func (monographService *MonographService) UpdateMonograph(id string, userId primitive.ObjectID, monographData graphql_models.MonographData, userRepo *repository.UserRepo) (*graphql_models.Monograph, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	monographUpdate, err := monographService.Repo.GetMonographById(objectId)
	if err != nil {
		return nil, err
	}

	exitsUser := false
	for _, teacherIn := range monographUpdate.TeachersIn {
		if teacherIn == userId {
			exitsUser = true
			break
		}
	}
	if !exitsUser {
		return nil, errors.New("the document not accessable for the user")
	}

	teachersIn := make([]primitive.ObjectID, len(monographData.TeachersIn)+1)
	teachersIn[0] = userId
	for i, teacher := range monographData.TeachersIn {
		teacherObjectId, err := primitive.ObjectIDFromHex(*teacher)
		if err != nil {
			return nil, err
		}
		teachersIn[i+1] = teacherObjectId
	}

	monographUpdate.TeachersIn = teachersIn
	monographUpdate.TeachersOut = monographData.TeachersOut
	monographUpdate.Title = monographData.Title
	monographUpdate.PublishLevel = monographData.PublishLevel
	monographUpdate.Rank = monographData.Rank
	monographUpdate.PublishDate = primitive.NewDateTimeFromTime(monographData.PublishDate)

	err = monographService.Repo.UpdateMonograph(monographUpdate)
	if err != nil {
		return nil, err
	}

	return monographService.GetMonographById(userId, id, userRepo)
}

func (monographService *MonographService) DeleteMonograph(userId primitive.ObjectID, id string, userRepo *repository.UserRepo) (*graphql_models.Monograph, error) {

	monographData, err := monographService.GetMonographById(userId, id, userRepo)
	if err != nil {
		return nil, err
	}

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	err = monographService.Repo.DeleteMonograph(objectId)
	if err != nil {
		return nil, err
	}

	return monographData, nil
}

func (monographService *MonographService) GetMonographById(userId primitive.ObjectID, id string, userRepo *repository.UserRepo) (*graphql_models.Monograph, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	monographData, err := monographService.Repo.GetMonographById(objectId)
	if err != nil {
		return nil, err
	}

	exitsUser := false
	for _, teacherIn := range monographData.TeachersIn {
		if teacherIn == userId {
			exitsUser = true
			break
		}
	}
	if !exitsUser {
		return nil, errors.New("the document not accessable for the user")
	}

	usersInExport, err := userRepo.GetUsersExportByIds(monographData.TeachersIn)
	if err != nil {
		return nil, err
	}

	return &graphql_models.Monograph{
		ID:           monographData.ID.Hex(),
		TeachersIn:   usersInExport,
		TeachersOut:  monographData.TeachersOut,
		Title:        monographData.Title,
		PublishDate:  monographData.PublishDate.Time(),
		PublishLevel: monographData.PublishLevel,
		Rank:         monographData.Rank,
		CreatedAt:    monographData.CreatedAt.Time(),
		UpdatedAt:    monographData.UpdatedAt.Time(),
	}, nil
}

func (monographService *MonographService) GetMonographsByFilter(userId primitive.ObjectID, filter graphql_models.MonographFilter, userRepo *repository.UserRepo, offset int, limit int) (*graphql_models.MonographQuery, error) {

	TeachersInID := make([]primitive.ObjectID, len(filter.TeachersIn)+1)
	TeachersInID[0] = userId
	for i, teacherIn := range filter.TeachersIn {
		objectId, err := primitive.ObjectIDFromHex(*teacherIn)
		if err != nil {
			return nil, err
		}
		TeachersInID[i+1] = objectId
	}

	monographsData, err := monographService.Repo.GetMonographsByParams(
		repository.MonoGraphParams{
			TeachersIn:       TeachersInID,
			TeachersOut:      filter.TeachersOut,
			Title:            filter.Title,
			PublishLevel:     filter.PublishLevel,
			Rank:             filter.Rank,
			PublishDateStart: filter.PublishDateStart,
			PublishDateEnd:   filter.PublishDateEnd,
			CreatedAtStart:   filter.CreatedStart,
			CreatedAtEnd:     filter.CreatedEnd,
			UpdatedAtStart:   filter.UpdatedStart,
			UpdatedAtEnd:     filter.UpdatedEnd,
		})
	if err != nil {
		return nil, err
	}

	// monographs := make([]*graphql_models.Monograph, len(monographsData))
	// for i, monograph := range monographsData {
	// 	usersInExport, err := userRepo.GetUsersExportByIds(monograph.TeachersIn)
	// 	if err != nil {
	// 		return nil, err
	// 	}

	// 	var publishDate *time.Time = nil
	// 	if monograph.PublishDate != nil {
	// 		date := monograph.PublishDate.Time()
	// 		publishDate = &date
	// 	}

	// 	monographs[i] = &graphql_models.Monograph{
	// 		ID:           monograph.ID.Hex(),
	// 		TeachersIn:   usersInExport,
	// 		TeachersOut:  monograph.TeachersOut,
	// 		Title:        monograph.Title,
	// 		PublishDate:  publishDate,
	// 		PublishLevel: monograph.PublishLevel,
	// 		Rank:         monograph.Rank,
	// 	}
	// }

	if len(monographsData) == 0 {
		return &graphql_models.MonographQuery{
			TotalCount: 0,
			Monographs: []*graphql_models.Monograph{},
		}, nil
	}

	if offset >= len(monographsData) || offset < 0 {
		return nil, errors.New("offset out of range")
	}

	if limit <= 0 {
		return nil, errors.New("limit must be greater than 0")
	}

	if limit+offset > len(monographsData) {
		limit = len(monographsData) - offset
	}

	monographs := make([]*graphql_models.Monograph, limit)

	for i := 0; i < limit; i++ {
		monographData := monographsData[i+offset]
		usersInExport, err := userRepo.GetUsersExportByIds(monographData.TeachersIn)
		if err != nil {
			return nil, err
		}

		monographs[i] = &graphql_models.Monograph{
			ID:           monographData.ID.Hex(),
			TeachersIn:   usersInExport,
			TeachersOut:  monographData.TeachersOut,
			Title:        monographData.Title,
			PublishDate:  monographData.PublishDate.Time(),
			PublishLevel: monographData.PublishLevel,
			Rank:         monographData.Rank,
			CreatedAt:    monographData.CreatedAt.Time(),
			UpdatedAt:    monographData.UpdatedAt.Time(),
		}
	}

	return &graphql_models.MonographQuery{
		TotalCount: len(monographsData),
		Monographs: monographs,
	}, nil
}
