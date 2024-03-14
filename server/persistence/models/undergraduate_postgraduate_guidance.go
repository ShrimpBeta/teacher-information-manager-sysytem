package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UndergraduatePostgraduateGuidance struct {
	ID                 primitive.ObjectID `bson:"_id"`
	TeacherId          primitive.ObjectID `bson:"teacherId"`
	ThesisTopic        string             `bson:"thesisTopic"`
	OpeningCheckDate   time.Time          `bson:"openingCheckDate"`
	OpeningCheckResult string             `bson:"openingCheckResult"`
	MidtermCheckDate   time.Time          `bson:"midtermCheckDate"`
	MidtermCheckResult string             `bson:"midtermCheckResult"`
	DefenseDate        time.Time          `bson:"defenseDate"`
	DefenseResult      string             `bson:"defenseResult"`
	CreatedAt          time.Time          `bson:"createdAt"`
	UpdateAt           time.Time          `bson:"updateAt"`
}
