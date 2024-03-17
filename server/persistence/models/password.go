package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 密码
type Password struct {
	ID          primitive.ObjectID `bson:"_id"`
	UserId      primitive.ObjectID `bson:"userId"`
	Url         string             `bson:"url,omitempty"`
	AppName     string             `bson:"appName,omitempty"`
	Account     string             `bson:"account"`
	Password    string             `bson:"password"`
	Description string             `bson:"description,omitempty"`
	CreatedAt   primitive.DateTime `bson:"createdAt"`
	UpdatedAt   primitive.DateTime `bson:"updatedAT"`
}
