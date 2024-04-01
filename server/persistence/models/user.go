package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID               primitive.ObjectID `bson:"_id"`
	Username         string             `bson:"username"`
	Email            string             `bson:"email"`
	Password         string             `bson:"password"`
	Avatar           string             `bson:"avatar"`
	Phone            *string            `bson:"phone,omitempty"`
	WechatOpenId     *string            `bson:"wechatOpenId,omitempty"`
	WechatSessionKey *string            `bson:"wechatSessionKey,omitempty"`
	Activate         bool               `bson:"activate"`
	MasterKey        string             `bson:"masterKey"`
	Salt             string             `bson:"salt"`
	CreatedAt        primitive.DateTime `bson:"createdAt"`
	UpdatedAt        primitive.DateTime `bson:"updatedAt"`
}

type RestfulUser struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Avatar    string    `json:"avatar,omitempty"`
	Activate  bool      `json:"activate"`
	CreatedAt time.Time `json:"createdAt"`
}

type RestfulCreateUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
