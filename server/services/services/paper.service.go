package services

import (
	graphql_models "server/graph/model"
	"server/persistence/models"
	"server/persistence/repository"

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
	publishDate := primitive.NewDateTimeFromTime(*newPaperData.PublishDate)

	newPaper := models.Paper{
		TeachersIn:   teachersIn,
		TeachersOut:  newPaperData.TeachersOut,
		Title:        newPaperData.Title,
		PublishDate:  &publishDate,
		Rank:         newPaperData.Rank,
		JournalName:  newPaperData.JournalName,
		JournalLevel: newPaperData.JournalLevel,
	}

	objectId, err := paperService.Repo.CreatePaper(&newPaper)
	if err != nil {
		return nil, err
	}

	paperData, err := paperService.Repo.GetPaperById(*objectId)
	if err != nil {
		return nil, err
	}
	createdPublishDate := paperData.PublishDate.Time()

	usersIn, err := userRepo.GetUsersByIds(teachersIn)
	if err != nil {
		return nil, err
	}
	userseExport := make([]*graphql_models.UserExport, len(usersIn))

	for i, user := range usersIn {
		userseExport[i] = &graphql_models.UserExport{
			ID:       user.ID.Hex(),
			Username: user.Username,
			Email:    user.Email,
			Avatar:   user.Avatar,
		}
	}

	return &graphql_models.Paper{
		ID:           paperData.ID.Hex(),
		TeachersIn:   userseExport,
		TeachersOut:  paperData.TeachersOut,
		Title:        paperData.Title,
		PublishDate:  &createdPublishDate,
		Rank:         paperData.Rank,
		JournalName:  paperData.JournalName,
		JournalLevel: paperData.JournalLevel,
		CreatedAt:    paperData.CreatedAt.Time(),
		UpdatedAt:    paperData.UpdatedAt.Time(),
	}, nil
}

func (paperService *PaperService) UpdatePaper(id string, paperData graphql_models.PaperData, userRepo *repository.UserRepo) (*graphql_models.Paper, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	publishDate := primitive.NewDateTimeFromTime(*paperData.PublishDate)

	paperUpdate := &models.Paper{
		ID:          objectId,
		TeachersOut: paperData.TeachersOut,
		Title:       paperData.Title,
		PublishDate: &publishDate,
		Rank:        paperData.Rank,
	}
	if paperData.TeachersIn != nil {
		teachersIn := make([]primitive.ObjectID, len(paperData.TeachersIn))
		for i, teacher := range paperData.TeachersIn {
			objectId, err := primitive.ObjectIDFromHex(*teacher)
			if err != nil {
				return nil, err
			}
			teachersIn[i] = objectId
		}
		paperUpdate.TeachersIn = teachersIn
	}

	err = paperService.Repo.UpdatePaper(paperUpdate)
	if err != nil {
		return nil, err
	}

	paperUpdate, err = paperService.Repo.GetPaperById(objectId)
	if err != nil {
		return nil, err
	}

	usersIn, err := userRepo.GetUsersByIds(paperUpdate.TeachersIn)
	if err != nil {
		return nil, err
	}
	userseExport := make([]*graphql_models.UserExport, len(usersIn))

	for i, user := range usersIn {
		userseExport[i] = &graphql_models.UserExport{
			ID:       user.ID.Hex(),
			Username: user.Username,
			Email:    user.Email,
			Avatar:   user.Avatar,
		}
	}

	updatePublishDate := paperUpdate.PublishDate.Time()

	return &graphql_models.Paper{
		ID:           paperUpdate.ID.Hex(),
		TeachersIn:   userseExport,
		TeachersOut:  paperUpdate.TeachersOut,
		Title:        paperUpdate.Title,
		PublishDate:  &updatePublishDate,
		Rank:         paperUpdate.Rank,
		JournalName:  paperUpdate.JournalName,
		JournalLevel: paperUpdate.JournalLevel,
		CreatedAt:    paperUpdate.CreatedAt.Time(),
		UpdatedAt:    paperUpdate.UpdatedAt.Time(),
	}, nil
}

func (paperService *PaperService) DeletePaper(id string, userRepo *repository.UserRepo) (*graphql_models.Paper, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	PaperData, err := paperService.Repo.GetPaperById(objectId)
	if err != nil {
		return nil, err
	}
	err = paperService.Repo.DeletePaper(objectId)
	if err != nil {
		return nil, err
	}

	usersIn, err := userRepo.GetUsersByIds(PaperData.TeachersIn)
	if err != nil {
		return nil, err
	}
	userseExport := make([]*graphql_models.UserExport, len(usersIn))

	for i, user := range usersIn {
		userseExport[i] = &graphql_models.UserExport{
			ID:       user.ID.Hex(),
			Username: user.Username,
			Email:    user.Email,
			Avatar:   user.Avatar,
		}
	}

	publishDate := PaperData.PublishDate.Time()

	return &graphql_models.Paper{
		ID:           PaperData.ID.Hex(),
		TeachersIn:   userseExport,
		TeachersOut:  PaperData.TeachersOut,
		Title:        PaperData.Title,
		PublishDate:  &publishDate,
		Rank:         PaperData.Rank,
		JournalName:  PaperData.JournalName,
		JournalLevel: PaperData.JournalLevel,
		CreatedAt:    PaperData.CreatedAt.Time(),
		UpdatedAt:    PaperData.UpdatedAt.Time(),
	}, nil
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
	publishDate := PaperData.PublishDate.Time()

	usersIn, err := userRepo.GetUsersByIds(PaperData.TeachersIn)
	if err != nil {
		return nil, err
	}
	userseExport := make([]*graphql_models.UserExport, len(usersIn))

	for i, user := range usersIn {
		userseExport[i] = &graphql_models.UserExport{
			ID:       user.ID.Hex(),
			Username: user.Username,
			Email:    user.Email,
			Avatar:   user.Avatar,
		}
	}

	TeachersOut := make([]*string, len(PaperData.TeachersOut))
	copy(TeachersOut, PaperData.TeachersOut)

	return &graphql_models.Paper{
		ID:           PaperData.ID.Hex(),
		TeachersIn:   userseExport,
		TeachersOut:  TeachersOut,
		Title:        PaperData.Title,
		PublishDate:  &publishDate,
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
		usersIn, err := userRepo.GetUsersByIds(paper.TeachersIn)
		if err != nil {
			return nil, err
		}
		userseExport := make([]*graphql_models.UserExport, len(usersIn))

		for i, user := range usersIn {
			userseExport[i] = &graphql_models.UserExport{
				ID:       user.ID.Hex(),
				Username: user.Username,
				Email:    user.Email,
				Avatar:   user.Avatar,
			}
		}

		TeachersOut := make([]*string, len(paper.TeachersOut))
		copy(TeachersOut, paper.TeachersOut)

		publishDate := paper.PublishDate.Time()

		papers[i] = &graphql_models.Paper{
			ID:           paper.ID.Hex(),
			TeachersIn:   userseExport,
			TeachersOut:  TeachersOut,
			Title:        paper.Title,
			PublishDate:  &publishDate,
			Rank:         paper.Rank,
			JournalName:  paper.JournalName,
			JournalLevel: paper.JournalLevel,
			CreatedAt:    paper.CreatedAt.Time(),
			UpdatedAt:    paper.UpdatedAt.Time(),
		}
	}

	return papers, nil
}
