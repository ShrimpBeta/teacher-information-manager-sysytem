package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Monograph struct {
	ID           primitive.ObjectID   `bson:"_id"`
	TeachersIn   []primitive.ObjectID `bson:"teachersIn"`
	TeachersOut  []string             `bson:"teachersOut"`
	Title        string               `bson:"string"`
	PublishDate  time.Time            `bson:"publishDate"`
	PublishLevel string               `bson:"publishLevel"`
	Rank         string               `bson:"rank"`
	CreatedAt    time.Time            `bson:"createdAt"`
	UpdateAt     time.Time            `bson:"updateAt"`
}
