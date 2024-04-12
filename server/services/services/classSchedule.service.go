package services

import (
	"errors"
	graphql_models "server/graph/model"
	"server/persistence/repository"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ClassScheduleService struct {
	Repo *repository.ClassScheduleRepo
}

func NewClassScheduleService(classScheduleRepo *repository.ClassScheduleRepo) *ClassScheduleService {
	return &ClassScheduleService{Repo: classScheduleRepo}
}

func (classScheduleService *ClassScheduleService) CreateAcademicTerm(userId primitive.ObjectID, termData graphql_models.NewAcademicTerm) (*graphql_models.AcademicTerm, error) {
	panic("not implemented")
}

func (classScheduleService *ClassScheduleService) UpdateAcademicTerm(termID string, termData graphql_models.UpdateAcademicTerm) (*graphql_models.AcademicTerm, error) {
	panic("not implemented")
}

func (classScheduleService *ClassScheduleService) DeleteAcademicTerm(termID string) (*graphql_models.AcademicTerm, error) {
	panic("not implemented")
}

func (classScheduleService *ClassScheduleService) CreateCourese(termID string, courseData graphql_models.CourseData) (*graphql_models.Course, error) {
	panic("not implemented")
}

func (classScheduleService *ClassScheduleService) UpdateCourse(termID string, courseID string, courseData graphql_models.CourseData) (*graphql_models.Course, error) {
	panic("not implemented")
}

func (classScheduleService *ClassScheduleService) DeleteCourse(termID string, courseID string) (*graphql_models.Course, error) {
	panic("not implemented")
}

func (classScheduleService *ClassScheduleService) GetAcademicTermById(id string) (*graphql_models.AcademicTerm, error) {
	panic("not implemented")
}

func (classScheduleService *ClassScheduleService) GetAcademicTerms(userId primitive.ObjectID, offset int, limit int) (*graphql_models.AcademicTermQuery, error) {
	AcademicTermsData, err := classScheduleService.Repo.GetAcademicTermsByUserId(userId)
	if err != nil {
		return nil, err
	}

	// academicTerms := make([]*graphql_models.AcademicTermShort, len(AcademicTermsData))
	// for i, academicterm := range AcademicTermsData {
	// 	academicTerms[i] = &graphql_models.AcademicTermShort{
	// 		ID:        academicterm.ID.Hex(),
	// 		TermName:  academicterm.Name,
	// 		CreatedAt: academicterm.CreatedAt.Time(),
	// 		UpdatedAt: academicterm.UpdatedAt.Time(),
	// 	}
	// }

	if len(AcademicTermsData) == 0 {
		return &graphql_models.AcademicTermQuery{
			TotalCount:    0,
			AcademicTerms: []*graphql_models.AcademicTermShort{},
		}, nil
	}

	if offset >= len(AcademicTermsData) || offset < 0 {
		return nil, errors.New("offset out of range")
	}

	if limit <= 0 {
		return nil, errors.New("limit must be greater than 0")
	}

	if limit+offset > len(AcademicTermsData) {
		limit = len(AcademicTermsData) - offset
	}

	academicTerms := make([]*graphql_models.AcademicTermShort, limit)
	for i := 0; i < limit; i++ {
		academictermData := AcademicTermsData[i+offset]
		academicTerms[i] = &graphql_models.AcademicTermShort{
			ID:        academictermData.ID.Hex(),
			TermName:  academictermData.Name,
			CreatedAt: academictermData.CreatedAt.Time(),
			UpdatedAt: academictermData.UpdatedAt.Time(),
		}
	}

	return &graphql_models.AcademicTermQuery{
		TotalCount:    len(AcademicTermsData),
		AcademicTerms: academicTerms,
	}, nil
}
