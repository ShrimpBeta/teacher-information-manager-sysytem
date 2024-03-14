package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type EducationReform struct {
	ID          primitive.ObjectID   `bson:"_id"`
	TeacherIn   []primitive.ObjectID `bson:"teachersIn"`
	TeacherOut  []string             `bson:"teachersOut"`
	Number      string               `bson:"number"`
	Title       string               `bson:"title"`
	StartDate   time.Time            `bson:"startDate"`
	Duration    string               `bson:"duration"`
	Level       string               `bson:"level"`
	Rank        string               `bson:"rank"`
	Achievement string               `bson:"achievement"`
	Fund        string               `bson:"fund"`
	CreatedAt   time.Time            `bson:"createAt"`
	UpdateAt    time.Time            `bson:"updateAt"`
}
