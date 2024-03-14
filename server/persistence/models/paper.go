package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Paper struct {
	ID           primitive.ObjectID   `bson:"_id"`
	TeacherIn    []primitive.ObjectID `bson:"teacherIn"`
	TeacherOut   []string             `bson:"teacherOut,omitempty"`
	Title        string               `bson:"title,omitempty"`
	PublishDate  time.Time            `bson:"publishDate,omitempty"`
	Rank         string               `bson:"rank,omitempty"`
	JournalName  string               `bson:"journalName,omitempty"`
	JournalLevel string               `bson:"journalLevel,omitempty"`
	CreatedAt    time.Time            `bson:"createdAt"`
	UpdateAt     time.Time            `bson:"updateAt"`
}
