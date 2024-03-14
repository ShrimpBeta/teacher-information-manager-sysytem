package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Password struct {
	ID          primitive.ObjectID `bson:"_id"`
	UserId      primitive.ObjectID `bson:"userId"`
	Url         string             `bson:"url,omitempty"`
	AppName     string             `bson:"appName,omitempty"`
	Account     string             `bson:"account"`
	Password    string             `bson:"password"`
	Description string             `bson:"description,omitempty"`
	CreatedAt   time.Time          `bson:"createAt"`
	UpdateAt    time.Time          `bson:"updateAT"`
}
