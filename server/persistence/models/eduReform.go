package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 教改项目
type EduReform struct {
	ID          primitive.ObjectID   `bson:"_id"`
	TeachersIn  []primitive.ObjectID `bson:"teachersIn"`
	TeachersOut []*string            `bson:"teachersOut,omitempty"`
	Number      string               `bson:"number"`
	Title       string               `bson:"title"`
	StartDate   primitive.DateTime   `bson:"startDate,omitempty"`
	Duration    *string              `bson:"duration,omitempty"`
	Level       *string              `bson:"level,omitempty"`
	Rank        *string              `bson:"rank,omitempty"`
	Achievement *string              `bson:"achievement,omitempty"`
	Fund        *string              `bson:"fund,omitempty"`
	CreatedAt   primitive.DateTime   `bson:"createdAt"`
	UpdatedAt   primitive.DateTime   `bson:"updatedAt"`
}

type EduReformReport struct {
	TeachersIn []primitive.ObjectID
	Title      string
	StartDate  primitive.DateTime
}
