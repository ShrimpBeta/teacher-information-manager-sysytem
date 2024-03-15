package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 竞赛指导
type CompetitionGuidance struct {
	ID           primitive.ObjectID `bson:"_id"`
	TeacherId    primitive.ObjectID `bson:"teacherId"`
	ProjectName  string             `bson:"projectName"`
	Students     []string           `bson:"students"`
	Grade        string             `bson:"grade,omitempty"`
	GuidanceDate time.Time          `bson:"guidanceDate,omitempty"`
	AwardStatus  string             `bson:"awardStatus,omitempty"`
	CreatedAt    time.Time          `bson:"createAt "`
	UpdateAt     time.Time          `bson:"updateAt"`
}
