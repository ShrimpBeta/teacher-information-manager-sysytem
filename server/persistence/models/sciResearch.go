package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 科研获奖
type AwardRecord struct {
	AwardName  string              `bson:"awardName"`
	AwardDate  *primitive.DateTime `bson:"awardDate,omitempty"`
	AwardLevel *string             `bson:"awardLevel,omitempty"`
	AwardRank  *string             `bson:"awardRank,omitempty"`
}

// 科研项目
type SciResearch struct {
	ID           primitive.ObjectID   `bson:"_id"`
	TeachersIn   []primitive.ObjectID `bson:"teachersIn"`
	TeachersOut  []*string            `bson:"teachersOut,omitempty"`
	Number       string               `bson:"number"`
	Title        string               `bson:"title"`
	StartDate    primitive.DateTime   `bson:"startDate,omitempty"`
	Duration     *string              `bson:"duration,omitempty"`
	Level        *string              `bson:"level,omitempty"`
	Rank         *string              `bson:"rank,omitempty"`
	Achievement  *string              `bson:"achievement,omitempty"`
	Fund         *string              `bson:"fund,omitempty"`
	IsAward      bool                 `bson:"isAward"`
	AwardRecords []*AwardRecord       `bson:"awarddRecords,omitempty"`
	CreatedAt    primitive.DateTime   `bson:"createdAt"`
	UpdatedAt    primitive.DateTime   `bson:"updatedAt"`
}

type SciResearchReport struct {
	TeachersIn []primitive.ObjectID
	Title      string
	StartDate  primitive.DateTime
}
