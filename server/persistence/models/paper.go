package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 论文
type Paper struct {
	ID           primitive.ObjectID   `bson:"_id"`
	TeachersIn   []primitive.ObjectID `bson:"teachersIn"`
	TeachersOut  []string             `bson:"teachersOut,omitempty"`
	Title        string               `bson:"title"`
	PublishDate  primitive.DateTime   `bson:"publishDate,omitempty"`
	Rank         string               `bson:"rank,omitempty"`
	JournalName  string               `bson:"journalName,omitempty"`
	JournalLevel string               `bson:"journalLevel,omitempty"`
	CreatedAt    primitive.DateTime   `bson:"createdAt"`
	UpdatedAt    primitive.DateTime   `bson:"updatedAt"`
}
