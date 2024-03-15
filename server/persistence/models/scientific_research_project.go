package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 科研获奖
type AwardScientificResearch struct {
	ID         primitive.ObjectID `bson:"_id"`
	AwardName  string             `bson:"awardName"`
	AwardDate  time.Time          `bson:"awardDate,omitempty"`
	AwardLevel string             `bson:"awardLevel,omitempty"`
	AwardRank  string             `bson:"awardRank,omitempty"`
	CreatedAt  time.Time          `bson:"createdAt"`
	UpdateAt   time.Time          `bson:"updateAt"`
}

// 科研项目
type ScientificResearch struct {
	ID          primitive.ObjectID   `bson:"_id"`
	TeachersIn  []primitive.ObjectID `bson:"teachersIn"`
	TeachersOut []string             `bson:"teachersOut,omitempty"`
	Number      string               `bson:"number,omitempty"`
	Title       string               `bson:"title"`
	StartDate   time.Time            `bson:"startDate,omitempty"`
	Duration    string               `bson:"duration,omitempty"`
	Level       string               `bson:"level,omitempty"`
	Rank        string               `bson:"rank,omitempty"`
	Achievement string               `bson:"achievement,omitempty"`
	Fund        string               `bson:"fund,omitempty"`
	IsAward     bool                 `bson:"isAward"`
	Awards      []primitive.ObjectID `bson:"awards,omitempty"`
	CreatedAt   time.Time            `bson:"createdAt"`
	UpdateAt    time.Time            `bson:"updateAt"`
}
