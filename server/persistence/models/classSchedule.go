package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 课程时间
type ClassTime struct {
	DayOfWeek uint `bson:"dayOfWeek"`
	Start     uint `bson:"start"`
	End       uint `bson:"end"`
}

// 课程表
type Course struct {
	ID           primitive.ObjectID `bson:"_id"`
	TeacherNames string             `bson:"teacherNames"`
	Name         string             `bson:"name"`
	Location     *string            `bson:"location,omitempty"`
	Type         *string            `bson:"type,omitempty"`
	Weeks        []*int             `bson:"weeks"`
	ClassTimes   []*ClassTime       `bson:"classTimes"`
	StudentCount *uint              `bson:"studentCount,omitempty"`
	Color        *string            `bson:"color,omitempty"`
}

// 学期
type AcademicTerm struct {
	ID        primitive.ObjectID `bson:"_id"`
	UserId    primitive.ObjectID `bson:"userId"`
	Name      string             `bson:"name"`
	StartDate primitive.DateTime `bson:"startDate"`
	WeekCount uint               `bson:"weekCount"`
	Courses   []*Course          `bson:"courses"`
	CreatedAt primitive.DateTime `bson:"createdAt"`
	UpdatedAt primitive.DateTime `bson:"updatedAt"`
}

type CourseReport struct {
	TeacherNames string
	Name         string
	StartDate    primitive.DateTime
}
