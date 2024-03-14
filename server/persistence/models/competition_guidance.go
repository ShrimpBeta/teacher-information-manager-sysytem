package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CompetitionGuidance struct {
	ID           primitive.ObjectID `bson:"_id"`
	TeacherId    primitive.ObjectID `bson:"teacherId"`
	ProjectName  string             `bson:"projectName"`
	Students     []string           `bson:"students"`
	Grade        string             `bson:"grade"`
	GuidanceDate time.Time          `bson:"guidanceDate"`
	AwardStatus  string             `bson:"awardStatus"`
	CreatedAt    time.Time          `bson:"createAt "`
	UpdateAt     time.Time          `bson:"updateAt"`
}
