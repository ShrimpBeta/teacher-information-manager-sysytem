package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AwardScientificResearch struct {
	ID         primitive.ObjectID `bson:"_id"`
	AwardName  string             `bson:"awardName"`
	AwardDate  time.Time          `bson:"awardDate"`
	AwardLevel string             `bson:"awardLevel"`
	AwardRank  string             `bson:"awardRank"`
	CreatedAt  time.Time          `bson:"createdAt"`
	UpdateAt   time.Time          `bson:"updateAt"`
}

type ScientificResearch struct {
	ID          primitive.ObjectID   `bson:"_id"`
	TeachersIn  []primitive.ObjectID `bson:"teachersIn"`
	TeachersOut []string             `bson:"teachersOut"`
	Number      string               `bson:"number"`
	Title       string               `bson:"title"`
	StartDate   time.Time            `bson:"startDate"`
	Duration    string               `bson:"duration"`
	Level       string               `bson:"level"`
	Rank        string               `bson:"rank"`
	Achievement string               `bson:"achievement"`
	Fund        string               `bson:"fund"`
	IsAward     bool                 `bson:"isAward"`
	Awards      []primitive.ObjectID `bson:"awards"`
	CreatedAt   time.Time            `bson:"createdAt"`
	UpdateAt    time.Time            `bson:"updateAt"`
}
