package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 导师制
type Mentorship struct {
	ID           primitive.ObjectID `bson:"_id"`
	TeacherId    primitive.ObjectID `bson:"teacherId"`
	ProjectName  string             `bson:"projectName"`
	StudentNames []string           `bson:"studentNames"`
	Grade        string             `bson:"grade,omitempty"`
	GuidanceDate time.Time          `bson:"guidanceDate,omitempty"`
	CreateAt     time.Time          `bson:"createdAt"`
	UpdateAt     time.Time          `bson:"updateAt"`
}
