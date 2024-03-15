package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 导师制
type MentorshipSystem struct {
	ID           primitive.ObjectID `bson:"_id"`
	TeacherId    primitive.ObjectID `bson:"teacherId"`
	ProjectName  string             `bson:"projectName"`
	Students     []string           `bson:"students"`
	Grade        string             `bson:"grade,omitempty"`
	GuidanceDate time.Time          `bson:"guidanceDate,omitempty"`
	CreateAt     time.Time          `bson:"createdAt"`
	UpdateAt     time.Time          `bson:"updateAt"`
}
