package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 课程时间
type WorkDay struct {
	Weekday time.Weekday `bson:"weekday"`
	Section string       `bson:"section"`
}

// 课程表
type Course struct {
	ID            primitive.ObjectID `bson:"_id"`
	Teachers      string             `bson:"teachers"`
	Name          string             `bson:"name"`
	Location      string             `bson:"location,omitempty"`
	Type          string             `bson:"type,omitempty"`
	Weeks         []string           `bson:"weeks"`
	Schedule      []WorkDay          `bson:"schedule"`
	StudentNumber uint16             `bson:"studentNumber,omitempty"`
	Background    string             `bson:"background,omitempty"`
	CreateAt      time.Time          `bson:"createAt"`
	UpdateAt      time.Time          `bson:"updateAt"`
}

// 学期
type Term struct {
	ID       primitive.ObjectID   `bson:"_id"`
	Name     string               `bson:"name"`
	Courses  []primitive.ObjectID `bson:"courses"`
	CreateAt time.Time            `bson:"createAt"`
	UpdateAt time.Time            `bson:"updateAt"`
}
