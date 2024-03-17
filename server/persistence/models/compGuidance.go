package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 竞赛指导
type CompeGuidance struct {
	ID               primitive.ObjectID `bson:"_id"`
	UserId           primitive.ObjectID `bson:"userId"`
	ProjectName      string             `bson:"projectName"`
	StudentNames     []string           `bson:"studentNames"`
	CompetitionScore string             `bson:"competitionScore,omitempty"`
	GuidanceDate     primitive.DateTime `bson:"guidanceDate,omitempty"`
	AwardStatus      string             `bson:"awardStatus,omitempty"`
	CreatedAt        primitive.DateTime `bson:"createdAt "`
	UpdatedAt        primitive.DateTime `bson:"updatedAt"`
}
