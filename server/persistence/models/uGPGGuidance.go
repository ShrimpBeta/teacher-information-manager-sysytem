package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 本科生、研究生指导
type UGPGGuidance struct {
	ID                 primitive.ObjectID `bson:"_id"`
	UserId             primitive.ObjectID `bson:"userId"`
	StudentName        string             `bson:"studentName"`
	ThesisTopic        string             `bson:"thesisTopic"`
	OpeningCheckDate   primitive.DateTime `bson:"openingCheckDate,omitempty"`
	OpeningCheckResult string             `bson:"openingCheckResult,omitempty"`
	MidtermCheckDate   primitive.DateTime `bson:"midtermCheckDate,omitempty"`
	MidtermCheckResult string             `bson:"midtermCheckResult,omitempty"`
	DefenseDate        primitive.DateTime `bson:"defenseDate,omitempty"`
	DefenseResult      string             `bson:"defenseResult,omitempty"`
	CreatedAt          primitive.DateTime `bson:"createdAt"`
	UpdatedAt          primitive.DateTime `bson:"updatedAt"`
}
