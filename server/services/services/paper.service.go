package services

import (
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

	return paperService.GetPaperById(objectId.Hex(), userRepo)
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

	teachersIn := make([]primitive.ObjectID, len(paperData.TeachersIn)+1)
	teachersIn[0] = userId
	for i, teacher := range paperData.TeachersIn {
		objectId, err := primitive.ObjectIDFromHex(*teacher)
		if err != nil {
			return nil, err
		}
		teachersIn[i+1] = objectId
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

	return paperService.GetPaperById(id, userRepo)
}

func (paperService *PaperService) DeletePaper(id string, userRepo *repository.UserRepo) (*graphql_models.Paper, error) {

	PaperData, err := paperService.GetPaperById(id, userRepo)
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

func (paperService *PaperService) GetPaperById(id string, userRepo *repository.UserRepo) (*graphql_models.Paper, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	PaperData, err := paperService.Repo.GetPaperById(objectId)
	if err != nil {
		return nil, err
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

func (paperService *PaperService) GetPapersByFilter(userId primitive.ObjectID, filter graphql_models.PaperFilter, userRepo *repository.UserRepo) ([]*graphql_models.Paper, error) {

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

	papers := make([]*graphql_models.Paper, len(papersData))
	for i, paper := range papersData {
		usersInExport, err := userRepo.GetUsersExportByIds(paper.TeachersIn)
		if err != nil {
			return nil, err
		}

		var publishDate *time.Time = nil
		if paper.PublishDate != nil {
			date := paper.PublishDate.Time()
			publishDate = &date
		}

		papers[i] = &graphql_models.Paper{
			ID:           paper.ID.Hex(),
			TeachersIn:   usersInExport,
			TeachersOut:  paper.TeachersOut,
			Title:        paper.Title,
			PublishDate:  publishDate,
			Rank:         paper.Rank,
			JournalName:  paper.JournalName,
			JournalLevel: paper.JournalLevel,
			CreatedAt:    paper.CreatedAt.Time(),
			UpdatedAt:    paper.UpdatedAt.Time(),
		}
	}

	return papers, nil
}
