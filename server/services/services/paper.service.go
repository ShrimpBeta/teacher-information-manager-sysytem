package services

import (
	"errors"
	graphql_models "server/graph/model"
	"server/persistence/models"
	"server/persistence/repository"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PaperService struct {
	Repo *repository.PaperRepo
}

func NewPaperService(paperRepo *repository.PaperRepo) *PaperService {
	return &PaperService{Repo: paperRepo}
}

func (paperService *PaperService) CreatePaper(userId primitive.ObjectID, newPaperData graphql_models.PaperData, userRepo *repository.UserRepo) (*graphql_models.Paper, error) {
	teachersIn := make([]primitive.ObjectID, len(newPaperData.TeachersIn)+1)
	teachersIn[0] = userId
	for i, teacher := range newPaperData.TeachersIn {
		objectId, err := primitive.ObjectIDFromHex(*teacher)
		if err != nil {
			return nil, err
		}
		teachersIn[i+1] = objectId
	}

	newPaper := models.Paper{
		TeachersIn:   teachersIn,
		TeachersOut:  newPaperData.TeachersOut,
		Title:        newPaperData.Title,
		Rank:         newPaperData.Rank,
		JournalName:  newPaperData.JournalName,
		JournalLevel: newPaperData.JournalLevel,
	}

	if newPaperData.PublishDate != nil {
		publishDate := primitive.NewDateTimeFromTime(*newPaperData.PublishDate)
		newPaper.PublishDate = &publishDate
	}

	objectId, err := paperService.Repo.CreatePaper(&newPaper)
	if err != nil {
		return nil, err
	}

	return paperService.GetPaperById(userId, objectId.Hex(), userRepo)
}

func (paperService *PaperService) UpdatePaper(id string, userId primitive.ObjectID, paperData graphql_models.PaperData, userRepo *repository.UserRepo) (*graphql_models.Paper, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	paperUpdate, err := paperService.Repo.GetPaperById(objectId)
	if err != nil {
		return nil, err
	}

	existsUser := false
	for _, teacherIn := range paperUpdate.TeachersIn {
		if teacherIn == userId {
			existsUser = true
			break
		}
	}
	if !existsUser {
		return nil, errors.New("the document not accessable for the user")
	}

	teachersIn := make([]primitive.ObjectID, len(paperData.TeachersIn)+1)
	teachersIn[0] = userId
	for i, teacher := range paperData.TeachersIn {
		teacherObjectId, err := primitive.ObjectIDFromHex(*teacher)
		if err != nil {
			return nil, err
		}
		teachersIn[i+1] = teacherObjectId
	}

	paperUpdate.TeachersIn = teachersIn
	paperUpdate.TeachersOut = paperData.TeachersOut
	paperUpdate.Title = paperData.Title
	paperUpdate.Rank = paperData.Rank
	paperUpdate.JournalName = paperData.JournalName
	paperUpdate.JournalLevel = paperData.JournalLevel

	if paperData.PublishDate == nil {
		paperUpdate.PublishDate = nil
	} else {
		publishDate := primitive.NewDateTimeFromTime(*paperData.PublishDate)
		paperUpdate.PublishDate = &publishDate
	}

	err = paperService.Repo.UpdatePaper(paperUpdate)
	if err != nil {
		return nil, err
	}

	return paperService.GetPaperById(userId, id, userRepo)
}

func (paperService *PaperService) DeletePaper(userId primitive.ObjectID, id string, userRepo *repository.UserRepo) (*graphql_models.Paper, error) {

	PaperData, err := paperService.GetPaperById(userId, id, userRepo)
	if err != nil {
		return nil, err
	}

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	err = paperService.Repo.DeletePaper(objectId)
	if err != nil {
		return nil, err
	}

	return PaperData, nil
}

func (paperService *PaperService) GetPaperById(userId primitive.ObjectID, id string, userRepo *repository.UserRepo) (*graphql_models.Paper, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	PaperData, err := paperService.Repo.GetPaperById(objectId)
	if err != nil {
		return nil, err
	}

	existsUser := false
	for _, teacherIn := range PaperData.TeachersIn {
		if teacherIn == userId {
			existsUser = true
			break
		}
	}
	if !existsUser {
		return nil, errors.New("the document not accessable for the user")
	}

	var publishDate *time.Time = nil
	if PaperData.PublishDate != nil {
		date := PaperData.PublishDate.Time()
		publishDate = &date
	}

	usersInExport, err := userRepo.GetUsersExportByIds(PaperData.TeachersIn)
	if err != nil {
		return nil, err
	}

	return &graphql_models.Paper{
		ID:           PaperData.ID.Hex(),
		TeachersIn:   usersInExport,
		TeachersOut:  PaperData.TeachersOut,
		Title:        PaperData.Title,
		PublishDate:  publishDate,
		Rank:         PaperData.Rank,
		JournalName:  PaperData.JournalName,
		JournalLevel: PaperData.JournalLevel,
		CreatedAt:    PaperData.CreatedAt.Time(),
		UpdatedAt:    PaperData.UpdatedAt.Time(),
	}, nil
}

func (paperService *PaperService) GetPapersByFilter(userId primitive.ObjectID, filter graphql_models.PaperFilter, userRepo *repository.UserRepo, offset int, limit int) (*graphql_models.PaperQuery, error) {

	TeachersInID := make([]primitive.ObjectID, len(filter.TeachersIn)+1)
	TeachersInID[0] = userId
	for i, teacherIn := range filter.TeachersIn {
		objectId, err := primitive.ObjectIDFromHex(*teacherIn)
		if err != nil {
			return nil, err
		}
		TeachersInID[i+1] = objectId
	}

	papersData, err := paperService.Repo.GetPapersByParams(
		repository.PaperQueryParams{
			TeachersIn:       TeachersInID,
			TeachersOut:      filter.TeachersOut,
			Title:            filter.Title,
			PublishDateStart: filter.PublishDateStart,
			PublishDateEnd:   filter.PublishDateEnd,
			Rank:             filter.Rank,
			JournalName:      filter.JournalName,
			JournalLevel:     filter.JournalLevel,
			CreatedAtStart:   filter.CreatedStart,
			CreatedAtEnd:     filter.CreatedEnd,
			UpdatedAtStart:   filter.UpdatedStart,
			UpdatedAtEnd:     filter.UpdatedEnd,
		},
	)
	if err != nil {
		return nil, err
	}

	// papers := make([]*graphql_models.Paper, len(papersData))
	// for i, paper := range papersData {
	// 	usersInExport, err := userRepo.GetUsersExportByIds(paper.TeachersIn)
	// 	if err != nil {
	// 		return nil, err
	// 	}

	// 	var publishDate *time.Time = nil
	// 	if paper.PublishDate != nil {
	// 		date := paper.PublishDate.Time()
	// 		publishDate = &date
	// 	}

	// 	papers[i] = &graphql_models.Paper{
	// 		ID:           paper.ID.Hex(),
	// 		TeachersIn:   usersInExport,
	// 		TeachersOut:  paper.TeachersOut,
	// 		Title:        paper.Title,
	// 		PublishDate:  publishDate,
	// 		Rank:         paper.Rank,
	// 		JournalName:  paper.JournalName,
	// 		JournalLevel: paper.JournalLevel,
	// 		CreatedAt:    paper.CreatedAt.Time(),
	// 		UpdatedAt:    paper.UpdatedAt.Time(),
	// 	}
	// }

	if len(papersData) == 0 {
		return &graphql_models.PaperQuery{
			TotalCount: 0,
			Papers:     []*graphql_models.Paper{},
		}, nil
	}

	if offset >= len(papersData) || offset < 0 {
		return nil, errors.New("offset out of range")
	}

	if limit <= 0 {
		return nil, errors.New("limit must be greater than 0")
	}

	if offset+limit > len(papersData) {
		limit = len(papersData) - offset
	}

	papers := make([]*graphql_models.Paper, limit)
	for i := 0; i < limit; i++ {
		paperData := papersData[i+offset]
		usersInExport, err := userRepo.GetUsersExportByIds(paperData.TeachersIn)
		if err != nil {
			return nil, err
		}

		var publishDate *time.Time = nil
		if paperData.PublishDate != nil {
			date := paperData.PublishDate.Time()
			publishDate = &date
		}

		papers[i] = &graphql_models.Paper{
			ID:           paperData.ID.Hex(),
			TeachersIn:   usersInExport,
			TeachersOut:  paperData.TeachersOut,
			Title:        paperData.Title,
			PublishDate:  publishDate,
			Rank:         paperData.Rank,
			JournalName:  paperData.JournalName,
			JournalLevel: paperData.JournalLevel,
			CreatedAt:    paperData.CreatedAt.Time(),
			UpdatedAt:    paperData.UpdatedAt.Time(),
		}
	}

	return &graphql_models.PaperQuery{
		TotalCount: len(papersData),
		Papers:     papers,
	}, nil
}
