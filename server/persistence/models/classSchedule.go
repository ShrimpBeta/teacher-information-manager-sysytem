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
	Location     string             `bson:"location,omitempty"`
	Type         string             `bson:"type,omitempty"`
	Weeks        []string           `bson:"weeks"`
	ClassTimes   []ClassTime        `bson:"classTimes"`
	StudentCount uint16             `bson:"studentCount,omitempty"`
	Background   string             `bson:"background,omitempty"`
	CreateAt     time.Time          `bson:"createAt"`
	UpdateAt     time.Time          `bson:"updateAt"`
}

// 学期
type AcademicTerm struct {
	ID        primitive.ObjectID   `bson:"_id"`
	TeacherId primitive.ObjectID   `bson:"teacherId"`
	Name      string               `bson:"name"`
	Courses   []primitive.ObjectID `bson:"courses"`
	CreateAt  time.Time            `bson:"createAt"`
	UpdateAt  time.Time            `bson:"updateAt"`
}
