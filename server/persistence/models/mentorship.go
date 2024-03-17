package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// 导师制
type Mentorship struct {
	ID           primitive.ObjectID `bson:"_id"`
	UserId       primitive.ObjectID `bson:"userId"`
	ProjectName  string             `bson:"projectName"`
	StudentNames []string           `bson:"studentNames"`
	Grade        string             `bson:"grade,omitempty"`
	GuidanceDate primitive.DateTime `bson:"guidanceDate,omitempty"`
	CreatedAt    primitive.DateTime `bson:"createdAt"`
	UpdatedAt    primitive.DateTime `bson:"updatedAt"`
}
