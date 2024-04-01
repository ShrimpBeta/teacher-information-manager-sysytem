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

func NewPaperService(r *repository.PaperRepo) *PaperService {
	return &PaperService{Repo: r}
}

func (p *PaperService) CreatePaper(newPaperData graphql_models.PaperData, userRepo *repository.UserRepo) (*graphql_models.Paper, error) {
	teachersIn := make([]primitive.ObjectID, len(newPaperData.TeachersIn))
	for i, teacher := range newPaperData.TeachersIn {
		objectId, err := primitive.ObjectIDFromHex(*teacher)
		if err != nil {
			return nil, err
		}
		teachersIn[i] = objectId
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

	objectId, err := p.Repo.CreatePaper(&newPaper)
	if err != nil {
		return nil, err
	}

	paperData, err := p.Repo.GetPaperById(*objectId)
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

func (p *PaperService) UpdatePaper(id string, paperData graphql_models.PaperData, userRepo *repository.UserRepo) (*graphql_models.Paper, error) {
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

	err = p.Repo.UpdatePaper(paperUpdate)
	if err != nil {
		return nil, err
	}

	paperUpdate, err = p.Repo.GetPaperById(objectId)
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

func (p *PaperService) DeletePaper(id string, userRepo *repository.UserRepo) (*graphql_models.Paper, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	PaperData, err := p.Repo.GetPaperById(objectId)
	if err != nil {
		return nil, err
	}
	err = p.Repo.DeletePaper(objectId)
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

func (p *PaperService) GetPaperById(id string, userRepo *repository.UserRepo) (*graphql_models.Paper, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	PaperData, err := p.Repo.GetPaperById(objectId)
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
	for i, teacher := range PaperData.TeachersOut {
		TeachersOut[i] = teacher
	}

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
