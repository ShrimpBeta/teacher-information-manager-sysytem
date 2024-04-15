package services

import (
	"errors"
	graphql_models "server/graph/model"
	"server/persistence/models"
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

	newCourses := make([]*models.Course, len(termData.Courses))
	if termData.Courses != nil && len(termData.Courses) > 0 {
		for i, courseData := range termData.Courses {

			if courseData.CourseTimes == nil || len(courseData.CourseTimes) == 0 {
				return nil, errors.New("classTimes is required")
			}

			newClassTimes := make([]models.ClassTime, len(courseData.CourseTimes))
			for j, classTimeData := range courseData.CourseTimes {
				newClassTimes[j] = models.ClassTime{
					DayOfWeek: uint(classTimeData.DayOfWeek),
					Start:     uint(classTimeData.Start),
					End:       uint(classTimeData.End),
				}
			}

			var studentCount *uint = nil
			if courseData.StudentCount != nil {
				studentCount = new(uint)
				*studentCount = uint(*courseData.StudentCount)
			}

			newCourses[i] = &models.Course{
				TeacherNames: courseData.TeacherNames,
				Name:         courseData.CourseName,
				Location:     courseData.CourseLocation,
				Type:         courseData.CourseType,
				Weeks:        courseData.CourseWeeks,
				StudentCount: studentCount,
				Color:        courseData.Color,
			}
		}
	}

	newAcademicTerm := models.AcademicTerm{
		UserId:    userId,
		Name:      termData.TermName,
		StartDate: primitive.NewDateTimeFromTime(termData.StartDate),
		WeekCount: uint(termData.WeekCount),
		Courses:   newCourses,
	}

	objectId, err := classScheduleService.Repo.CreateAcademicTerm(&newAcademicTerm)
	if err != nil {
		return nil, err
	}

	return classScheduleService.GetAcademicTermById(objectId.Hex())

}

func (classScheduleService *ClassScheduleService) UpdateAcademicTerm(termID string, termData graphql_models.UpdateAcademicTerm) (*graphql_models.AcademicTerm, error) {

	objectId, err := primitive.ObjectIDFromHex(termID)
	if err != nil {
		return nil, err
	}

	err = classScheduleService.Repo.UpdateAcademicTerm(&models.AcademicTerm{
		ID:        objectId,
		Name:      termData.TermName,
		StartDate: primitive.NewDateTimeFromTime(termData.StartDate),
		WeekCount: uint(termData.WeekCount),
	})
	if err != nil {
		return nil, err
	}

	return classScheduleService.GetAcademicTermById(termID)
}

func (classScheduleService *ClassScheduleService) DeleteAcademicTerm(termID string) (*graphql_models.AcademicTerm, error) {

	objectId, err := primitive.ObjectIDFromHex(termID)
	if err != nil {
		return nil, err
	}

	academicTermData, err := classScheduleService.GetAcademicTermById(termID)
	if err != nil {
		return nil, err
	}

	err = classScheduleService.Repo.DeleteAcademicTerm(objectId)
	if err != nil {
		return nil, err
	}

	return academicTermData, nil
}

func (classScheduleService *ClassScheduleService) CreateCourese(termID string, courseData graphql_models.CourseData) (*graphql_models.Course, error) {

	objectId, err := primitive.ObjectIDFromHex(termID)
	if err != nil {
		return nil, err
	}

	if courseData.CourseTimes == nil || len(courseData.CourseTimes) == 0 {
		return nil, errors.New("classTimes is required")
	}

	newClassTimes := make([]*models.ClassTime, len(courseData.CourseTimes))
	for i, classTimeData := range courseData.CourseTimes {
		newClassTimes[i] = &models.ClassTime{
			DayOfWeek: uint(classTimeData.DayOfWeek),
			Start:     uint(classTimeData.Start),
			End:       uint(classTimeData.End),
		}
	}

	var studentCount *uint = nil
	if courseData.StudentCount != nil {
		studentCount = new(uint)
		*studentCount = uint(*courseData.StudentCount)
	}

	newCourseData := models.Course{
		TeacherNames: courseData.TeacherNames,
		Name:         courseData.CourseName,
		Location:     courseData.CourseLocation,
		Type:         courseData.CourseType,
		Weeks:        courseData.CourseWeeks,
		ClassTimes:   newClassTimes,
		StudentCount: studentCount,
		Color:        courseData.Color,
	}

	courseId, err := classScheduleService.Repo.CreateCourse(objectId, &newCourseData)
	if err != nil {
		return nil, err
	}

	return classScheduleService.GetCourseById(termID, courseId.Hex())
}

func (classScheduleService *ClassScheduleService) UpdateCourse(termID string, courseID string, courseData graphql_models.CourseData) (*graphql_models.Course, error) {
	termObjectId, err := primitive.ObjectIDFromHex(termID)
	if err != nil {
		return nil, err
	}

	courseObjectId, err := primitive.ObjectIDFromHex(courseID)
	if err != nil {
		return nil, err
	}

	if courseData.CourseTimes == nil || len(courseData.CourseTimes) == 0 {
		return nil, errors.New("classTimes is required")
	}

	updateClassTimes := make([]*models.ClassTime, len(courseData.CourseTimes))
	for i, classTimeData := range courseData.CourseTimes {
		updateClassTimes[i] = &models.ClassTime{
			DayOfWeek: uint(classTimeData.DayOfWeek),
			Start:     uint(classTimeData.Start),
			End:       uint(classTimeData.End),
		}
	}

	var studentCount *uint = nil
	if courseData.StudentCount != nil {
		studentCount = new(uint)
		*studentCount = uint(*courseData.StudentCount)
	}

	courseUpdate, err := classScheduleService.Repo.GetCourseById(termObjectId, courseObjectId)
	if err != nil {
		return nil, err
	}

	if courseUpdate == nil {
		return nil, errors.New("course not found")
	}

	courseUpdate.TeacherNames = courseData.TeacherNames
	courseUpdate.Name = courseData.CourseName
	courseUpdate.Location = courseData.CourseLocation
	courseUpdate.Type = courseData.CourseType
	courseUpdate.Weeks = courseData.CourseWeeks
	courseUpdate.ClassTimes = updateClassTimes
	courseUpdate.StudentCount = studentCount
	courseUpdate.Color = courseData.Color

	err = classScheduleService.Repo.UpdateCourse(termObjectId, courseUpdate)
	if err != nil {
		return nil, err
	}

	return classScheduleService.GetCourseById(termID, courseID)
}

func (classScheduleService *ClassScheduleService) DeleteCourse(termID string, courseID string) (*graphql_models.Course, error) {
	termObjectId, err := primitive.ObjectIDFromHex(termID)
	if err != nil {
		return nil, err
	}

	courseObjectId, err := primitive.ObjectIDFromHex(courseID)
	if err != nil {
		return nil, err
	}

	courseData, err := classScheduleService.GetCourseById(termID, courseID)
	if err != nil {
		return nil, err
	}

	if courseData == nil {
		return nil, errors.New("course not found")
	}

	err = classScheduleService.Repo.DeleteCourse(termObjectId, courseObjectId)
	if err != nil {
		return nil, err
	}

	return courseData, nil
}

func (classScheduleService *ClassScheduleService) GetCourseById(termId, courseID string) (*graphql_models.Course, error) {
	termObjectId, err := primitive.ObjectIDFromHex(termId)
	if err != nil {
		return nil, err
	}

	courseObjectId, err := primitive.ObjectIDFromHex(courseID)
	if err != nil {
		return nil, err
	}

	courseData, err := classScheduleService.Repo.GetCourseById(termObjectId, courseObjectId)
	if err != nil {
		return nil, err
	}

	if courseData == nil {
		return nil, errors.New("course not found")
	}

	classTimes := make([]*graphql_models.ClassTime, len(courseData.ClassTimes))
	for i, classTimeData := range courseData.ClassTimes {
		classTimes[i] = &graphql_models.ClassTime{
			DayOfWeek: int(classTimeData.DayOfWeek),
			Start:     int(classTimeData.Start),
			End:       int(classTimeData.End),
		}
	}

	var studentCount *int = nil
	if courseData.StudentCount != nil {
		studentCount = new(int)
		*studentCount = int(*courseData.StudentCount)
	}

	return &graphql_models.Course{
		ID:             courseData.ID.Hex(),
		TeacherNames:   courseData.TeacherNames,
		CourseName:     courseData.Name,
		CourseLocation: courseData.Location,
		CourseType:     courseData.Type,
		CourseWeeks:    courseData.Weeks,
		StudentCount:   studentCount,
		Color:          courseData.Color,
		CourseTimes:    classTimes,
	}, nil
}

func (classScheduleService *ClassScheduleService) GetAcademicTermById(id string) (*graphql_models.AcademicTerm, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	academicTermData, err := classScheduleService.Repo.GetAcademicTermById(objectId)
	if err != nil {
		return nil, err
	}

	courses := make([]*graphql_models.Course, len(academicTermData.Courses))
	for i, courseData := range academicTermData.Courses {
		classTimes := make([]*graphql_models.ClassTime, len(courseData.ClassTimes))
		for j, classTimeData := range courseData.ClassTimes {
			classTimes[j] = &graphql_models.ClassTime{
				DayOfWeek: int(classTimeData.DayOfWeek),
				Start:     int(classTimeData.Start),
				End:       int(classTimeData.End),
			}
		}

		var studentCount *int = nil
		if courseData.StudentCount != nil {
			studentCount = new(int)
			*studentCount = int(*courseData.StudentCount)
		}

		courses[i] = &graphql_models.Course{
			ID:             courseData.ID.Hex(),
			TeacherNames:   courseData.TeacherNames,
			CourseName:     courseData.Name,
			CourseLocation: courseData.Location,
			CourseType:     courseData.Type,
			CourseWeeks:    courseData.Weeks,
			StudentCount:   studentCount,
			Color:          courseData.Color,
			CourseTimes:    classTimes,
		}
	}

	return &graphql_models.AcademicTerm{
		ID:        academicTermData.ID.Hex(),
		TermName:  academicTermData.Name,
		StartDate: academicTermData.StartDate.Time(),
		WeekCount: int(academicTermData.WeekCount),
		Courses:   courses,
		CreatedAt: academicTermData.CreatedAt.Time(),
		UpdatedAt: academicTermData.UpdatedAt.Time(),
	}, nil
}

func (classScheduleService *ClassScheduleService) GetAcademicTermsByFilter(userId primitive.ObjectID, filter graphql_models.AcademicTermFilter, offset int, limit int) (*graphql_models.AcademicTermQuery, error) {

	AcademicTermsData, err := classScheduleService.Repo.GetAcademicTermsByParams(
		repository.ClassScheduleQueryParams{
			UserId:   userId,
			TermName: filter.TermName,
		},
	)
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
			StartDate: academictermData.StartDate.Time(),
			WeekCount: int(academictermData.WeekCount),
			CreatedAt: academictermData.CreatedAt.Time(),
			UpdatedAt: academictermData.UpdatedAt.Time(),
		}
	}

	return &graphql_models.AcademicTermQuery{
		TotalCount:    len(AcademicTermsData),
		AcademicTerms: academicTerms,
	}, nil
}
