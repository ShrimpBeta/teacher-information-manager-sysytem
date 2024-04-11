package services

import (
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

func (classScheduleService *ClassScheduleService) GetAcademicTerms(userId primitive.ObjectID) (*graphql_models.AcademicTermQuery, error) {
	AcademicTermsData, err := classScheduleService.Repo.GetAcademicTermsByUserId(userId)
	if err != nil {
		return nil, err
	}

	academicTerms := make([]*graphql_models.AcademicTermShort, len(AcademicTermsData))
	for i, academicterm := range AcademicTermsData {
		academicTerms[i] = &graphql_models.AcademicTermShort{
			ID:        academicterm.ID.Hex(),
			TermName:  academicterm.Name,
			CreatedAt: academicterm.CreatedAt.Time(),
			UpdatedAt: academicterm.UpdatedAt.Time(),
		}
	}
	return &graphql_models.AcademicTermQuery{
		TotalCount:    len(academicTerms),
		AcademicTerms: academicTerms,
	}, nil
}
