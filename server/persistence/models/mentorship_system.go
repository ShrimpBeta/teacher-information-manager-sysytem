package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MentorshipSystem struct {
	ID           primitive.ObjectID `bson:"_id"`
	TeacherId    primitive.ObjectID `bson:"teacherId"`
	Students     []string           `bson:"students"`
	Grade        string             `bson:"grade"`
	GuidanceDate time.Time          `bson:"guidanceDate"`
	CreateAt     time.Time          `bson:"createdAt"`
	UpdateAt     time.Time          `bson:"updateAt"`
}
