package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 本科生、研究生指导
type UndergraduatePostgraduateGuidance struct {
	ID                 primitive.ObjectID `bson:"_id"`
	TeacherId          primitive.ObjectID `bson:"teacherId"`
	StudentName        string             `bson:"studentName"`
	ThesisTopic        string             `bson:"thesisTopic"`
	OpeningCheckDate   time.Time          `bson:"openingCheckDate,omitempty"`
	OpeningCheckResult string             `bson:"openingCheckResult,omitempty"`
	MidtermCheckDate   time.Time          `bson:"midtermCheckDate,omitempty"`
	MidtermCheckResult string             `bson:"midtermCheckResult,omitempty"`
	DefenseDate        time.Time          `bson:"defenseDate,omitempty"`
	DefenseResult      string             `bson:"defenseResult,omitempty"`
	CreatedAt          time.Time          `bson:"createdAt"`
	UpdateAt           time.Time          `bson:"updateAt"`
}
