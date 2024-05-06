package services

import (
	"errors"
	"fmt"
	graphql_models "server/graph/model"
	"server/persistence/models"
	"server/persistence/repository"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SciResearchService struct {
	Repo *repository.SciResearchRepo
}

func NewSciResearchService(sciResearchRepo *repository.SciResearchRepo) *SciResearchService {
	return &SciResearchService{Repo: sciResearchRepo}
}

func (s *SciResearchService) CreateSciResearch(userId primitive.ObjectID, newSciResearchData graphql_models.SciResearchData, userRepo *repository.UserRepo) (*graphql_models.SciResearch, error) {
	teachersIn := make([]primitive.ObjectID, len(newSciResearchData.TeachersIn)+1)
	teachersIn[0] = userId
	for i, teacher := range newSciResearchData.TeachersIn {
		objectId, err := primitive.ObjectIDFromHex(*teacher)
		if err != nil {
			return nil, err
		}
		teachersIn[i+1] = objectId
	}

	isAward := false
	if newSciResearchData.Awards != nil && len(newSciResearchData.Awards) > 0 {
		isAward = true
	}

	newSciResearch := models.SciResearch{
		TeachersIn:  teachersIn,
		TeachersOut: newSciResearchData.TeachersOut,
		Title:       newSciResearchData.Title,
		Number:      newSciResearchData.Number,
		Duration:    newSciResearchData.Duration,
		Rank:        newSciResearchData.Rank,
		Level:       newSciResearchData.Level,
		Achievement: newSciResearchData.Achievement,
		Fund:        newSciResearchData.Fund,
		IsAward:     isAward,
		StartDate:   primitive.NewDateTimeFromTime(newSciResearchData.StartDate),
	}

	if newSciResearchData.Awards != nil {
		awards := make([]*models.AwardRecord, len(newSciResearchData.Awards))
		for i, award := range newSciResearchData.Awards {
			awards[i] = &models.AwardRecord{
				AwardName:  award.AwardName,
				AwardLevel: award.AwardLevel,
				AwardRank:  award.AwardRank,
			}
			if award.AwardDate != nil {
				date := primitive.NewDateTimeFromTime(*award.AwardDate)
				awards[i].AwardDate = &date
			}
		}
		newSciResearch.AwardRecords = awards
	}

	objectId, err := s.Repo.CreateSciResearch(&newSciResearch)
	if err != nil {
		return nil, err
	}

	return s.GetSciResearchById(userId, objectId.Hex(), userRepo)
}

func (s *SciResearchService) UpdateSciResearch(sciResearchID string, userId primitive.ObjectID, sciResearchData graphql_models.SciResearchData, userRepo *repository.UserRepo) (*graphql_models.SciResearch, error) {
	objectId, err := primitive.ObjectIDFromHex(sciResearchID)
	if err != nil {
		return nil, err
	}

	sciResearchUpdate, err := s.Repo.GetSciResearchById(objectId)
	if err != nil {
		return nil, err
	}

	existsUser := false
	for _, teacherIn := range sciResearchUpdate.TeachersIn {
		if teacherIn == userId {
			existsUser = true
			break
		}
	}
	if !existsUser {
		return nil, errors.New("the document not accessable for the user")
	}

	teachersIn := make([]primitive.ObjectID, len(sciResearchData.TeachersIn)+1)
	teachersIn[0] = userId
	for i, teacher := range sciResearchData.TeachersIn {
		teacherObjectId, err := primitive.ObjectIDFromHex(*teacher)
		if err != nil {
			return nil, err
		}
		teachersIn[i+1] = teacherObjectId
	}

	isAward := false
	if sciResearchData.Awards != nil && len(sciResearchData.Awards) > 0 {
		isAward = true
	}

	sciResearchUpdate.TeachersIn = teachersIn
	sciResearchUpdate.TeachersOut = sciResearchData.TeachersOut
	sciResearchUpdate.Title = sciResearchData.Title
	sciResearchUpdate.Number = sciResearchData.Number
	sciResearchUpdate.Duration = sciResearchData.Duration
	sciResearchUpdate.Rank = sciResearchData.Rank
	sciResearchUpdate.Level = sciResearchData.Level
	sciResearchUpdate.Achievement = sciResearchData.Achievement
	sciResearchUpdate.Fund = sciResearchData.Fund
	sciResearchUpdate.IsAward = isAward
	sciResearchUpdate.StartDate = primitive.NewDateTimeFromTime(sciResearchData.StartDate)

	if sciResearchData.Awards == nil {
		sciResearchUpdate.AwardRecords = nil
	} else {
		awards := make([]*models.AwardRecord, len(sciResearchData.Awards))
		for i, award := range sciResearchData.Awards {
			awards[i] = &models.AwardRecord{
				AwardName:  award.AwardName,
				AwardLevel: award.AwardLevel,
				AwardRank:  award.AwardRank,
			}
			if award.AwardDate != nil {
				date := primitive.NewDateTimeFromTime(*award.AwardDate)
				awards[i].AwardDate = &date
			}
		}
		sciResearchUpdate.AwardRecords = awards
	}

	err = s.Repo.UpdateSciResearch(sciResearchUpdate)
	if err != nil {
		return nil, err
	}

	return s.GetSciResearchById(userId, sciResearchID, userRepo)
}

func (s *SciResearchService) DeleteSciResearch(userId primitive.ObjectID, sciResearchID string, userRepo *repository.UserRepo) (*graphql_models.SciResearch, error) {
	sciResearchData, err := s.GetSciResearchById(userId, sciResearchID, userRepo)
	if err != nil {
		return nil, err
	}

	objectId, err := primitive.ObjectIDFromHex(sciResearchID)
	if err != nil {
		return nil, err
	}
	err = s.Repo.DeleteSciResearch(objectId)
	if err != nil {
		return nil, err
	}

	return sciResearchData, nil
}

func (s *SciResearchService) GetSciResearchById(userId primitive.ObjectID, sciResearchID string, userRepo *repository.UserRepo) (*graphql_models.SciResearch, error) {
	objectId, err := primitive.ObjectIDFromHex(sciResearchID)
	if err != nil {
		return nil, err
	}

	sciResearchData, err := s.Repo.GetSciResearchById(objectId)
	if err != nil {
		return nil, err
	}

	existsUser := false
	for _, teacherIn := range sciResearchData.TeachersIn {
		if teacherIn == userId {
			existsUser = true
			break
		}
	}
	if !existsUser {
		return nil, errors.New("the document not accessable for the user")
	}

	usersInExport, err := userRepo.GetUsersExportByIds(sciResearchData.TeachersIn)
	if err != nil {
		return nil, err
	}

	var awards []*graphql_models.AwardRecord = nil
	if sciResearchData.AwardRecords != nil {
		awards = make([]*graphql_models.AwardRecord, len(sciResearchData.AwardRecords))
		for i, award := range sciResearchData.AwardRecords {
			var awardDate *time.Time = nil
			if award.AwardDate != nil {
				date := award.AwardDate.Time()
				awardDate = &date
			}
			awards[i] = &graphql_models.AwardRecord{
				AwardName:  award.AwardName,
				AwardDate:  awardDate,
				AwardLevel: award.AwardLevel,
				AwardRank:  award.AwardRank,
			}
		}
	}

	return &graphql_models.SciResearch{
		ID:          sciResearchData.ID.Hex(),
		TeachersIn:  usersInExport,
		TeachersOut: sciResearchData.TeachersOut,
		Title:       sciResearchData.Title,
		Number:      sciResearchData.Number,
		StartDate:   sciResearchData.StartDate.Time(),
		Duration:    sciResearchData.Duration,
		Level:       sciResearchData.Level,
		Rank:        sciResearchData.Rank,
		Achievement: sciResearchData.Achievement,
		Fund:        sciResearchData.Fund,
		IsAward:     sciResearchData.IsAward,
		Awards:      awards,
		CreatedAt:   sciResearchData.CreatedAt.Time(),
		UpdatedAt:   sciResearchData.UpdatedAt.Time(),
	}, nil
}

func (s *SciResearchService) GetSciResearchsByFilter(userId primitive.ObjectID, filter graphql_models.SciResearchFilter, userRepo *repository.UserRepo, offset int, limit int) (*graphql_models.SciResearchQuery, error) {
	teachersInID := make([]primitive.ObjectID, len(filter.TeachersIn)+1)
	teachersInID[0] = userId
	for i, teacherIn := range filter.TeachersIn {
		objectId, err := primitive.ObjectIDFromHex(*teacherIn)
		if err != nil {
			return nil, err
		}
		teachersInID[i+1] = objectId
	}

	sciResearchsData, err := s.Repo.GetSciResearchsByParams(
		repository.SciResearchQueryParams{
			TeachersIn:     teachersInID,
			TeachersOut:    filter.TeachersOut,
			Title:          filter.Title,
			Number:         filter.Number,
			StartDateStart: filter.StartDateStart,
			StartDateEnd:   filter.StartDateEnd,
			Level:          filter.Level,
			Rank:           filter.Rank,
			Achievement:    filter.Achievement,
			Fund:           filter.Fund,
			IsAward:        filter.IsAward,
			AwardName:      filter.AwardName,
			AwardDateStart: filter.AwardDateStart,
			AwardDateEnd:   filter.AwardDateEnd,
			AwardLevel:     filter.AwardLevel,
			AwardRank:      filter.AwardRank,
		},
	)
	if err != nil {
		return nil, err
	}

	// sciResearchs := make([]*graphql_models.SciResearch, len(sciResearchsData))
	// for i, sciResearchData := range sciResearchsData {
	// 	usersInExport, err := userRepo.GetUsersExportByIds(sciResearchData.TeachersIn)
	// 	if err != nil {
	// 		return nil, err
	// 	}

	// 	var startDate *time.Time = nil
	// 	if sciResearchData.StartDate != nil {
	// 		date := sciResearchData.StartDate.Time()
	// 		startDate = &date
	// 	}

	// 	var awards []*graphql_models.AwardRecord = nil
	// 	if sciResearchData.AwardRecords != nil {
	// 		awards = make([]*graphql_models.AwardRecord, len(sciResearchData.AwardRecords))
	// 		for i, award := range sciResearchData.AwardRecords {
	// 			var awardDate *time.Time = nil
	// 			if award.AwardDate != nil {
	// 				date := award.AwardDate.Time()
	// 				awardDate = &date
	// 			}
	// 			awards[i] = &graphql_models.AwardRecord{
	// 				AwardName:  award.AwardName,
	// 				AwardDate:  awardDate,
	// 				AwardLevel: award.AwardLevel,
	// 				AwardRank:  award.AwardRank,
	// 			}
	// 		}
	// 	}

	// 	sciResearchs[i] = &graphql_models.SciResearch{
	// 		ID:          sciResearchData.ID.Hex(),
	// 		TeachersIn:  usersInExport,
	// 		TeachersOut: sciResearchData.TeachersOut,
	// 		Title:       sciResearchData.Title,
	// 		Number:      sciResearchData.Number,
	// 		StartDate:   startDate,
	// 		Duration:    sciResearchData.Duration,
	// 		Level:       sciResearchData.Level,
	// 		Rank:        sciResearchData.Rank,
	// 		Achievement: sciResearchData.Achievement,
	// 		Fund:        sciResearchData.Fund,
	// 		IsAward:     sciResearchData.IsAward,
	// 		Awards:      awards,
	// 	}
	// }

	if len(sciResearchsData) == 0 {
		return &graphql_models.SciResearchQuery{
			TotalCount:   0,
			SciResearchs: []*graphql_models.SciResearch{},
		}, nil
	}

	if offset >= len(sciResearchsData) || offset < 0 {
		return nil, errors.New("offset out of range")
	}

	if limit <= 0 {
		return nil, errors.New("limit must be greater than 0")
	}

	if offset+limit > len(sciResearchsData) {
		limit = len(sciResearchsData) - offset
	}

	sciResearchs := make([]*graphql_models.SciResearch, limit)
	for i := 0; i < limit; i++ {
		sciResearchData := sciResearchsData[i+offset]

		usersInExport, err := userRepo.GetUsersExportByIds(sciResearchData.TeachersIn)
		if err != nil {
			return nil, err
		}

		var awards []*graphql_models.AwardRecord = nil
		if sciResearchData.AwardRecords != nil {
			awards = make([]*graphql_models.AwardRecord, len(sciResearchData.AwardRecords))
			for i, award := range sciResearchData.AwardRecords {
				var awardDate *time.Time = nil
				if award.AwardDate != nil {
					date := award.AwardDate.Time()
					awardDate = &date
				}
				awards[i] = &graphql_models.AwardRecord{
					AwardName:  award.AwardName,
					AwardDate:  awardDate,
					AwardLevel: award.AwardLevel,
					AwardRank:  award.AwardRank,
				}
			}
		}

		sciResearchs[i] = &graphql_models.SciResearch{
			ID:          sciResearchData.ID.Hex(),
			TeachersIn:  usersInExport,
			TeachersOut: sciResearchData.TeachersOut,
			Title:       sciResearchData.Title,
			Number:      sciResearchData.Number,
			StartDate:   sciResearchData.StartDate.Time(),
			Duration:    sciResearchData.Duration,
			Level:       sciResearchData.Level,
			Rank:        sciResearchData.Rank,
			Achievement: sciResearchData.Achievement,
			Fund:        sciResearchData.Fund,
			IsAward:     sciResearchData.IsAward,
			Awards:      awards,
			CreatedAt:   sciResearchData.CreatedAt.Time(),
			UpdatedAt:   sciResearchData.UpdatedAt.Time(),
		}
	}

	return &graphql_models.SciResearchQuery{
		TotalCount:   len(sciResearchsData),
		SciResearchs: sciResearchs,
	}, nil
}

func (s *SciResearchService) UploadSciResearchs(file graphql.Upload, userRepo *repository.UserRepo) (*graphql_models.SciResearchPreview, error) {
	panic(fmt.Errorf("not implemented: UploadSciResearchs - uploadSciResearchs"))
}
