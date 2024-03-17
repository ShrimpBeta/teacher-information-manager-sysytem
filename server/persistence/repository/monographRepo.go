package repository

import (
	"context"
	"server/persistence/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MonographRepo struct {
	collection *mongo.Collection
}

type MonoGraphParams struct {
	TeachersIn  []primitive.ObjectID
	TeachersOut []string
	Title       string
}

func NewMonographRepo(db *mongo.Database) *MonographRepo {
	return &MonographRepo{
		collection: db.Collection("Monograph"),
	}
}

func (r *MonographRepo) GetMonographById(id primitive.ObjectID) (*models.Monograph, error) {
	monograph := models.Monograph{}
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&monograph)
	if err != nil {
		return nil, err
	}
	return &monograph, nil
}

func (r *MonographRepo) GetMonographsByParams(params MonoGraphParams) ([]models.Monograph, error) {
	monographs := []models.Monograph{}

	//  filter for teachersIn,can not be empty
	filter := bson.M{"teachersIn": bson.M{"$in": params.TeachersIn}}
	//  filter for teachersOut
	if len(params.TeachersOut) > 0 {
		filter["teachersOut"] = bson.M{"$in": params.TeachersOut}
	}
	// filter for title
	if params.Title != "" {
		filter["title"] = params.Title
	}
	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		monograph := models.Monograph{}
		err := cursor.Decode(&monograph)
		if err != nil {
			return nil, err
		}
		monographs = append(monographs, monograph)
	}
	return monographs, nil
}

func (r *MonographRepo) CreateMonograph(monograph *models.Monograph) (*primitive.ObjectID, error) {
	result, err := r.collection.InsertOne(context.Background(), monograph)
	if err != nil {
		return nil, err
	}
	newMonograph := result.InsertedID.(primitive.ObjectID)
	return &newMonograph, nil
}

func (r *MonographRepo) UpdateMonograph(id primitive.ObjectID, monograph *models.Monograph) error {
	_, err := r.collection.UpdateOne(context.Background(), bson.M{"_id": id}, bson.M{"$set": monograph})
	return err
}

func (r *MonographRepo) DeleteMonograph(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
