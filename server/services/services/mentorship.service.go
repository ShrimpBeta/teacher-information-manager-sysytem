package services

import (
	graphql_models "server/graph/model"
	"server/persistence/models"
	"server/persistence/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MentorshipService struct {
	Repo *repository.MentorshipRepo
}

func NewMentorshipService(mentorshipRepo *repository.MentorshipRepo) *MentorshipService {
	return &MentorshipService{Repo: mentorshipRepo}
}

func (mentorshipService *MentorshipService) CreateMentorship(userID string, newMentorshipData graphql_models.MentorshipData) (*graphql_models.Mentorship, error) {
	userObjectId, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	guidanceDate := primitive.NewDateTimeFromTime(*newMentorshipData.GuidanceDate)

	newMentorship := models.Mentorship{
		UserId:       userObjectId,
		ProjectName:  newMentorshipData.ProjectName,
		StudentNames: newMentorshipData.StudentNames,
		Grade:        newMentorshipData.Grade,
		GuidanceDate: &guidanceDate,
	}
	objectId, err := mentorshipService.Repo.CreateMentorship(&newMentorship)
	if err != nil {
		return nil, err
	}
	mentorshipData, err := mentorshipService.Repo.GetMentorshipById(*objectId)
	if err != nil {
		return nil, err
	}

	updateGuidanceDate := mentorshipData.GuidanceDate.Time()
	return &graphql_models.Mentorship{
		ID:           mentorshipData.ID.Hex(),
		ProjectName:  mentorshipData.ProjectName,
		StudentNames: mentorshipData.StudentNames,
		Grade:        mentorshipData.Grade,
		GuidanceDate: &updateGuidanceDate,
		CreatedAt:    mentorshipData.CreatedAt.Time(),
		UpdatedAt:    mentorshipData.UpdatedAt.Time(),
	}, nil
}

func (mentorshipService *MentorshipService) UpdateMentorship(id string, mentorshipData graphql_models.MentorshipData) (*graphql_models.Mentorship, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	guidanceDate := primitive.NewDateTimeFromTime(*mentorshipData.GuidanceDate)

	mentorshipUpdate := &models.Mentorship{
		ID:           objectId,
		ProjectName:  mentorshipData.ProjectName,
		StudentNames: mentorshipData.StudentNames,
		Grade:        mentorshipData.Grade,
		GuidanceDate: &guidanceDate,
	}

	err = mentorshipService.Repo.UpdateMentorship(mentorshipUpdate)
	if err != nil {
		return nil, err
	}
	mentorshipUpdate, err = mentorshipService.Repo.GetMentorshipById(objectId)
	if err != nil {
		return nil, err
	}

	updateGuidanceDate := mentorshipUpdate.GuidanceDate.Time()

	return &graphql_models.Mentorship{
		ID:           mentorshipUpdate.ID.Hex(),
		ProjectName:  mentorshipUpdate.ProjectName,
		StudentNames: mentorshipUpdate.StudentNames,
		Grade:        mentorshipUpdate.Grade,
		GuidanceDate: &updateGuidanceDate,
		CreatedAt:    mentorshipUpdate.CreatedAt.Time(),
		UpdatedAt:    mentorshipUpdate.UpdatedAt.Time(),
	}, nil
}

func (mentorshipService *MentorshipService) DeleteMentorship(id string) (*graphql_models.Mentorship, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	mentorshipData, err := mentorshipService.Repo.GetMentorshipById(objectId)
	if err != nil {
		return nil, err
	}
	err = mentorshipService.Repo.DeleteMentorship(objectId)
	if err != nil {
		return nil, err
	}

	guidanceDate := mentorshipData.GuidanceDate.Time()
	return &graphql_models.Mentorship{
		ID:           mentorshipData.ID.Hex(),
		ProjectName:  mentorshipData.ProjectName,
		StudentNames: mentorshipData.StudentNames,
		Grade:        mentorshipData.Grade,
		GuidanceDate: &guidanceDate,
		CreatedAt:    mentorshipData.CreatedAt.Time(),
		UpdatedAt:    mentorshipData.UpdatedAt.Time(),
	}, nil
}

func (mentorshipService *MentorshipService) GetMentorshipById(id string) (*graphql_models.Mentorship, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	mentorshipData, err := mentorshipService.Repo.GetMentorshipById(objectId)
	if err != nil {
		return nil, err
	}

	guidanceDate := mentorshipData.GuidanceDate.Time()
	return &graphql_models.Mentorship{
		ID:           mentorshipData.ID.Hex(),
		ProjectName:  mentorshipData.ProjectName,
		StudentNames: mentorshipData.StudentNames,
		Grade:        mentorshipData.Grade,
		GuidanceDate: &guidanceDate,
		CreatedAt:    mentorshipData.CreatedAt.Time(),
		UpdatedAt:    mentorshipData.UpdatedAt.Time(),
	}, nil
}

func (mentorshipService *MentorshipService) GetMentorshipsByUserId(userID string) ([]*graphql_models.Mentorship, error) {
	userObjectId, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	mentorshipsData, err := mentorshipService.Repo.GetMentorshipsByParams(repository.MentorshipQueryParams{UserId: userObjectId})
	if err != nil {
		return nil, err
	}
	mentorships := make([]*graphql_models.Mentorship, len(mentorshipsData))
	for i, mentorship := range mentorshipsData {
		guidanceDate := mentorship.GuidanceDate.Time()
		mentorships[i] = &graphql_models.Mentorship{
			ID:           mentorship.ID.Hex(),
			ProjectName:  mentorship.ProjectName,
			StudentNames: mentorship.StudentNames,
			Grade:        mentorship.Grade,
			GuidanceDate: &guidanceDate,
			CreatedAt:    mentorship.CreatedAt.Time(),
			UpdatedAt:    mentorship.UpdatedAt.Time(),
		}
	}
	return mentorships, nil
}
