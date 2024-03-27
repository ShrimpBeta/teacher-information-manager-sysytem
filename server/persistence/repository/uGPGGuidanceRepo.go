package repository

import (
	"context"
	"server/persistence/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UGPGGuidanceRepo struct {
	collection *mongo.Collection
}

type UGPGGuidanceQueryParams struct {
	UserId      primitive.ObjectID
	StudentName string
	ThesisTopic string
}

func NewUGPGGuidanceRepo(db *mongo.Database) *UGPGGuidanceRepo {
	return &UGPGGuidanceRepo{
		collection: db.Collection("UGPGGuidance"),
	}
}

func (r *UGPGGuidanceRepo) GetUGPGGuidanceById(id primitive.ObjectID) (*models.UGPGGuidance, error) {
	ugpgGuidance := models.UGPGGuidance{}
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&ugpgGuidance)
	if err != nil {
		return nil, err
	}
	return &ugpgGuidance, nil
}

func (r *UGPGGuidanceRepo) GetUGPGGuidancesByParams(params UGPGGuidanceQueryParams) ([]models.UGPGGuidance, error) {
	ugpgGuidances := []models.UGPGGuidance{}

	// filter for userId
	filter := bson.M{"userId": params.UserId}
	// filter for studentName
	if params.StudentName != "" {
		filter["studentName"] = params.StudentName
	}
	// filter for thesisTopic
	if params.ThesisTopic != "" {
		filter["thesisTopic"] = params.ThesisTopic
	}

	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var ugpgGuidance models.UGPGGuidance
		if err := cursor.Decode(&ugpgGuidance); err != nil {
			return nil, err
		}
		ugpgGuidances = append(ugpgGuidances, ugpgGuidance)
	}
	return ugpgGuidances, nil
}

func (r *UGPGGuidanceRepo) CreateUGPGGuidance(ugpgGuidance *models.UGPGGuidance) (*primitive.ObjectID, error) {
	objectId := primitive.NewObjectID()
	ugpgGuidance.ID = objectId
	ugpgGuidance.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	ugpgGuidance.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	result, err := r.collection.InsertOne(context.Background(), ugpgGuidance)
	if err != nil {
		return nil, err
	}
	newUGPGGuidanceId := result.InsertedID.(primitive.ObjectID)
	return &newUGPGGuidanceId, nil
}

func (r *UGPGGuidanceRepo) UpdateUGPGGuidance(ugpgGuidance *models.UGPGGuidance) error {
	ugpgGuidance.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	_, err := r.collection.UpdateOne(context.Background(), bson.M{"_id": ugpgGuidance.ID}, bson.M{"$set": ugpgGuidance})
	return err
}

func (r *UGPGGuidanceRepo) DeleteUGPGGuidance(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
