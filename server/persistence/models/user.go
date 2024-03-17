package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID          primitive.ObjectID `bson:"_id"`
	Username    string             `bson:"username"`
	Email       string             `bson:"email"`
	Password    string             `bson:"password"`
	Avatar      string             `bson:"avatar"`
	Phone       string             `bson:"phone,omitempty"`
	WechatToken string             `bson:"wechatToken,omitempty"`
	Activate    bool               `bson:"activate"`
	CreatedAt   time.Time          `bson:"createAt"`
	UpdateAt    time.Time          `bson:"updateAT"`
}
