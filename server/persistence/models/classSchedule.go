package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 课程时间
type ClassTime struct {
	DayOfWeek time.Weekday `bson:"dayOfWeek"`
	TimeSlot  string       `bson:"timeSlot"`
}

// 课程表
type Course struct {
	ID           primitive.ObjectID `bson:"_id"`
	TeacherNames string             `bson:"teacherNames"`
	Name         string             `bson:"name"`
	Location     *string            `bson:"location,omitempty"`
	Type         *string            `bson:"type,omitempty"`
	Weeks        []*string          `bson:"weeks"`
	ClassTimes   []*ClassTime       `bson:"classTimes"`
	StudentCount *uint16            `bson:"studentCount,omitempty"`
	Color        *string            `bson:"color,omitempty"`
}

// 学期
type AcademicTerm struct {
	ID        primitive.ObjectID `bson:"_id"`
	UserId    primitive.ObjectID `bson:"userId"`
	Name      string             `bson:"name"`
	Courses   []*Course          `bson:"courses,omitempty"`
	CreatedAt primitive.DateTime `bson:"createdAt"`
	UpdatedAt primitive.DateTime `bson:"updatedAt"`
}
