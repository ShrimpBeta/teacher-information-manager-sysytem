package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 教改项目
type EduReform struct {
	ID          primitive.ObjectID   `bson:"_id"`
	TeacherIn   []primitive.ObjectID `bson:"teachersIn"`
	TeacherOut  []string             `bson:"teachersOut,omitempty"`
	Number      string               `bson:"number"`
	Title       string               `bson:"title"`
	StartDate   time.Time            `bson:"startDate,omitempty"`
	Duration    string               `bson:"duration,omitempty"`
	Level       string               `bson:"level,omitempty"`
	Rank        string               `bson:"rank,omitempty"`
	Achievement string               `bson:"achievement,omitempty"`
	Fund        string               `bson:"fund,omitempty"`
	CreatedAt   time.Time            `bson:"createAt"`
	UpdateAt    time.Time            `bson:"updateAt"`
}
