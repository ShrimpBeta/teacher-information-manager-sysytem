package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 专著
type Monograph struct {
	ID           primitive.ObjectID   `bson:"_id"`
	TeachersIn   []primitive.ObjectID `bson:"teachersIn"`
	TeachersOut  []string             `bson:"teachersOut,omitempty"`
	Title        string               `bson:"string"`
	PublishDate  primitive.DateTime   `bson:"publishDate,omitempty"`
	PublishLevel string               `bson:"publishLevel,omitempty"`
	Rank         string               `bson:"rank,omitempty"`
	CreatedAt    primitive.DateTime   `bson:"createdAt"`
	UpdatedAt    primitive.DateTime   `bson:"updatedAt"`
}
