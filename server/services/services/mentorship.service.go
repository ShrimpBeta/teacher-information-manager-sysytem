package services

import (
	"errors"
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

func (mentorshipService *MentorshipService) CreateMentorship(userId primitive.ObjectID, newMentorshipData graphql_models.MentorshipData) (*graphql_models.Mentorship, error) {

	newMentorship := models.Mentorship{
		UserId:       userId,
		ProjectName:  newMentorshipData.ProjectName,
		StudentNames: newMentorshipData.StudentNames,
		Grade:        newMentorshipData.Grade,
		GuidanceDate: primitive.NewDateTimeFromTime(newMentorshipData.GuidanceDate),
	}

	objectId, err := mentorshipService.Repo.CreateMentorship(&newMentorship)
	if err != nil {
		return nil, err
	}

	return mentorshipService.GetMentorshipById(userId, objectId.Hex())
}

func (mentorshipService *MentorshipService) UpdateMentorship(userId primitive.ObjectID, id string, mentorshipData graphql_models.MentorshipData) (*graphql_models.Mentorship, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	mentorshipUpdate, err := mentorshipService.Repo.GetMentorshipById(objectId)
	if err != nil {
		return nil, err
	}

	if mentorshipUpdate.UserId != userId {
		return nil, errors.New("the document not accessable for the user")
	}

	mentorshipUpdate.ProjectName = mentorshipData.ProjectName
	mentorshipUpdate.StudentNames = mentorshipData.StudentNames
	mentorshipUpdate.Grade = mentorshipData.Grade
	mentorshipUpdate.GuidanceDate = primitive.NewDateTimeFromTime(mentorshipData.GuidanceDate)

	err = mentorshipService.Repo.UpdateMentorship(mentorshipUpdate)
	if err != nil {
		return nil, err
	}

	return mentorshipService.GetMentorshipById(userId, id)
}

func (mentorshipService *MentorshipService) DeleteMentorship(userId primitive.ObjectID, id string) (*graphql_models.Mentorship, error) {
	mentorshipData, err := mentorshipService.GetMentorshipById(userId, id)
	if err != nil {
		return nil, err
	}

	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	err = mentorshipService.Repo.DeleteMentorship(objectId)
	if err != nil {
		return nil, err
	}

	return mentorshipData, nil
}

func (mentorshipService *MentorshipService) GetMentorshipById(userId primitive.ObjectID, id string) (*graphql_models.Mentorship, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	mentorshipData, err := mentorshipService.Repo.GetMentorshipById(objectId)
	if err != nil {
		return nil, err
	}

	if mentorshipData.UserId != userId {
		return nil, errors.New("the document not accessable for the user")
	}

	return &graphql_models.Mentorship{
		ID:           mentorshipData.ID.Hex(),
		ProjectName:  mentorshipData.ProjectName,
		StudentNames: mentorshipData.StudentNames,
		Grade:        mentorshipData.Grade,
		GuidanceDate: mentorshipData.GuidanceDate.Time(),
		CreatedAt:    mentorshipData.CreatedAt.Time(),
		UpdatedAt:    mentorshipData.UpdatedAt.Time(),
	}, nil
}

func (mentorshipService *MentorshipService) GetMentorshipsByFilter(userId primitive.ObjectID, filter graphql_models.MentorshipFilter, offset int, limit int) (*graphql_models.MentorshipQuery, error) {
	mentorshipsData, err := mentorshipService.Repo.GetMentorshipsByParams(
		repository.MentorshipQueryParams{
			UserId:            userId,
			ProjectName:       filter.ProjectName,
			StudentNames:      filter.StudentNames,
			Grade:             filter.Grade,
			GuidanceDateStart: filter.GuidanceDateStart,
			GuidanceDateEnd:   filter.GuidanceDateEnd,
			CreatedAtStart:    filter.CreatedStart,
			CreatedAtEnd:      filter.CreatedEnd,
			UpdatedAtStart:    filter.UpdatedStart,
			UpdatedAtEnd:      filter.UpdatedEnd,
		})
	if err != nil {
		return nil, err
	}

	// mentorships := make([]*graphql_models.Mentorship, len(mentorshipsData))
	// for i, mentorship := range mentorshipsData {
	// 	guidanceDate := mentorship.GuidanceDate.Time()
	// 	mentorships[i] = &graphql_models.Mentorship{
	// 		ID:           mentorship.ID.Hex(),
	// 		ProjectName:  mentorship.ProjectName,
	// 		StudentNames: mentorship.StudentNames,
	// 		Grade:        mentorship.Grade,
	// 		GuidanceDate: &guidanceDate,
	// 		CreatedAt:    mentorship.CreatedAt.Time(),
	// 		UpdatedAt:    mentorship.UpdatedAt.Time(),
	// 	}
	// }

	if len(mentorshipsData) == 0 {
		return &graphql_models.MentorshipQuery{
			TotalCount:  0,
			Mentorships: []*graphql_models.Mentorship{},
		}, nil
	}

	if offset >= len(mentorshipsData) || offset < 0 {
		return nil, errors.New("offset out of range")
	}

	if limit <= 0 {
		return nil, errors.New("limit must be greater than 0")
	}

	if limit+offset > len(mentorshipsData) {
		limit = len(mentorshipsData) - offset
	}

	mentorships := make([]*graphql_models.Mentorship, limit)
	for i := 0; i < limit; i++ {
		mentorshipData := mentorshipsData[i+offset]

		mentorships[i] = &graphql_models.Mentorship{
			ID:           mentorshipData.ID.Hex(),
			ProjectName:  mentorshipData.ProjectName,
			StudentNames: mentorshipData.StudentNames,
			Grade:        mentorshipData.Grade,
			GuidanceDate: mentorshipData.GuidanceDate.Time(),
			CreatedAt:    mentorshipData.CreatedAt.Time(),
			UpdatedAt:    mentorshipData.UpdatedAt.Time(),
		}
	}

	return &graphql_models.MentorshipQuery{
		TotalCount:  len(mentorshipsData),
		Mentorships: mentorships,
	}, nil
}
