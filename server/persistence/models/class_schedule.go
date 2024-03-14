package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 课程时间
type Day struct {
	ID      primitive.ObjectID `bson:"_id"`
	Weekday time.Weekday       `bson:"weekday"`
	Start   uint16             `bson:"start"`
	End     uint16             `bson:"end"`
}

// 课程表
type Course struct {
	ID            primitive.ObjectID   `bson:"_id"`
	TeacherIn     []primitive.ObjectID `bson:"teacherIn"`
	TeacherOut    []string             `bson:"teacherOut"`
	Name          string               `bson:"name"`
	Location      string               `bson:"location"`
	Type          string               `bson:"type"`
	StartWek      uint16               `bson:"startWeek"`
	EndWeek       uint16               `bson:"endWeek"`
	Schedule      []primitive.ObjectID `bson:"schedule"`
	StudentNumber uint16               `bson:"studentNumber"`
	CreateAt      time.Time            `bson:"createAt"`
	UpdateAt      time.Time            `bson:"updateAt"`
}

// 学期
type Term struct {
	ID       primitive.ObjectID   `bson:"_id"`
	Name     string               `bson:"name"`
	Courses  []primitive.ObjectID `bson:"courses"`
	CreateAt time.Time            `bson:"createAt"`
	UpdateAt time.Time            `bson:"updateAt"`
}
