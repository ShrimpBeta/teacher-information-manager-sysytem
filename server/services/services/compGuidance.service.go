package services

import (
	graphql_models "server/graph/model"
	"server/persistence/models"
	"server/persistence/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CompGuidanceService struct {
	Repo *repository.CompGuidanceRepo
}

func NewCompGuidanceService(r *repository.CompGuidanceRepo) *CompGuidanceService {
	return &CompGuidanceService{Repo: r}
}

func (c *CompGuidanceService) CreateCompGuidance(userID string, newGuidanceData graphql_models.CompGuidanceData) (*graphql_models.CompGuidance, error) {
	userObjectId, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	guidanceDate := primitive.NewDateTimeFromTime(*newGuidanceData.GuidanceDate)

	newCompGuidance := models.CompGuidance{
		UserId:           userObjectId,
		ProjectName:      newGuidanceData.ProjectName,
		StudentNames:     newGuidanceData.StudentNames,
		CompetitionScore: newGuidanceData.CompetitionScore,
		GuidanceDate:     &guidanceDate,
		AwardStatus:      newGuidanceData.AwardStatus,
	}
	objectId, err := c.Repo.CratedCompGuidance(&newCompGuidance)
	if err != nil {
		return nil, err
	}
	comGuidanceData, err := c.Repo.GetCompGuidanceById(*objectId)
	if err != nil {
		return nil, err
	}

	createdGuidanceDate := comGuidanceData.GuidanceDate.Time()
	return &graphql_models.CompGuidance{
		ID:               comGuidanceData.ID.Hex(),
		ProjectName:      comGuidanceData.ProjectName,
		StudentNames:     newGuidanceData.StudentNames,
		CompetitionScore: comGuidanceData.CompetitionScore,
		GuidanceDate:     &createdGuidanceDate,
		AwardStatus:      comGuidanceData.AwardStatus,
		CreatedAt:        comGuidanceData.CreatedAt.Time(),
		UpdatedAt:        comGuidanceData.UpdatedAt.Time(),
	}, nil
}

func (c *CompGuidanceService) UpdateCompGuidance(id string, compGuidanceData graphql_models.CompGuidanceData) (*graphql_models.CompGuidance, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	guidaceDate := primitive.NewDateTimeFromTime(*compGuidanceData.GuidanceDate)

	compGuidanceUpdate := &models.CompGuidance{
		ID:               objectId,
		ProjectName:      compGuidanceData.ProjectName,
		StudentNames:     compGuidanceData.StudentNames,
		CompetitionScore: compGuidanceData.CompetitionScore,
		GuidanceDate:     &guidaceDate,
		AwardStatus:      compGuidanceData.AwardStatus,
	}

	err = c.Repo.UpdateCompGuidance(compGuidanceUpdate)
	if err != nil {
		return nil, err
	}
	compGuidanceUpdate, err = c.Repo.GetCompGuidanceById(objectId)
	if err != nil {
		return nil, err
	}

	guidanceDate := compGuidanceUpdate.GuidanceDate.Time()
	return &graphql_models.CompGuidance{
		ID:               compGuidanceUpdate.ID.Hex(),
		ProjectName:      compGuidanceUpdate.ProjectName,
		StudentNames:     compGuidanceUpdate.StudentNames,
		CompetitionScore: compGuidanceUpdate.CompetitionScore,
		GuidanceDate:     &guidanceDate,
		AwardStatus:      compGuidanceUpdate.AwardStatus,
		CreatedAt:        compGuidanceUpdate.CreatedAt.Time(),
		UpdatedAt:        compGuidanceUpdate.UpdatedAt.Time(),
	}, nil
}

func (c *CompGuidanceService) DeleteCompGuidance(id string) (*graphql_models.CompGuidance, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	compGuidanceData, err := c.Repo.GetCompGuidanceById(objectId)
	if err != nil {
		return nil, err
	}

	err = c.Repo.DeleteCompGuidance(objectId)
	if err != nil {
		return nil, err
	}

	guidanceDate := compGuidanceData.GuidanceDate.Time()
	return &graphql_models.CompGuidance{
		ID:               compGuidanceData.ID.Hex(),
		ProjectName:      compGuidanceData.ProjectName,
		StudentNames:     compGuidanceData.StudentNames,
		CompetitionScore: compGuidanceData.CompetitionScore,
		GuidanceDate:     &guidanceDate,
		AwardStatus:      compGuidanceData.AwardStatus,
		CreatedAt:        compGuidanceData.CreatedAt.Time(),
		UpdatedAt:        compGuidanceData.UpdatedAt.Time(),
	}, nil
}

func (c *CompGuidanceService) GetCompGuidanceById(id string) (*graphql_models.CompGuidance, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	compGuidanceData, err := c.Repo.GetCompGuidanceById(objectId)
	if err != nil {
		return nil, err
	}

	guidanceDate := compGuidanceData.GuidanceDate.Time()
	return &graphql_models.CompGuidance{
		ID:               compGuidanceData.ID.Hex(),
		ProjectName:      compGuidanceData.ProjectName,
		StudentNames:     compGuidanceData.StudentNames,
		CompetitionScore: compGuidanceData.CompetitionScore,
		GuidanceDate:     &guidanceDate,
		AwardStatus:      compGuidanceData.AwardStatus,
		CreatedAt:        compGuidanceData.CreatedAt.Time(),
		UpdatedAt:        compGuidanceData.UpdatedAt.Time(),
	}, nil
}

func (c *CompGuidanceService) GetCompGuidancesByUserId(userID string) ([]*graphql_models.CompGuidance, error) {
	userObjectId, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	compGuidancesData, err := c.Repo.GetCompGuidancesByParams(repository.CompGuidanceQueryParams{UserId: userObjectId})
	if err != nil {
		return nil, err
	}
	compGuidances := make([]*graphql_models.CompGuidance, len(compGuidancesData))
	for i, compGuidanceData := range compGuidancesData {

		guidanceDate := compGuidanceData.GuidanceDate.Time()
		compGuidances[i] = &graphql_models.CompGuidance{
			ID:               compGuidanceData.ID.Hex(),
			ProjectName:      compGuidanceData.ProjectName,
			StudentNames:     compGuidanceData.StudentNames,
			CompetitionScore: compGuidanceData.CompetitionScore,
			GuidanceDate:     &guidanceDate,
			AwardStatus:      compGuidanceData.AwardStatus,
			CreatedAt:        compGuidanceData.CreatedAt.Time(),
			UpdatedAt:        compGuidanceData.UpdatedAt.Time(),
		}
	}
	return compGuidances, nil
}
