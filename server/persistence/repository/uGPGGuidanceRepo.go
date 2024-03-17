package repository

import (
	"context"
	"server/persistence/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UGPGGuidanceRepo struct {
	collection *mongo.Collection
}

func NewUGPGGuidanceRepo(db *mongo.Database) *UGPGGuidanceRepo {
	return &UGPGGuidanceRepo{
		collection: db.Collection("UGPGGuidances"),
	}
}

func (r *UGPGGuidanceRepo) GetUGPGGuidanceById(id string) (*models.UGPGGuidance, error) {
	ugpgGuidance := models.UGPGGuidance{}
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&ugpgGuidance)
	if err != nil {
		return nil, err
	}
	return &ugpgGuidance, nil
}

func (r *UGPGGuidanceRepo) GetUGPGGuidancesByName(studentName string, userId primitive.ObjectID) ([]models.UGPGGuidance, error) {
	ugpgGuidances := []models.UGPGGuidance{}
	cursor, err := r.collection.Find(context.Background(), bson.M{"name": studentName, "userId": userId})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		ugpgGuidance := models.UGPGGuidance{}
		err := cursor.Decode(&ugpgGuidance)
		if err != nil {
			return nil, err
		}
		ugpgGuidances = append(ugpgGuidances, ugpgGuidance)
	}
	return ugpgGuidances, nil
}

func (r *UGPGGuidanceRepo) GetUGPGGuidancesByThesisTopic(thesisTopic string, userId primitive.ObjectID) ([]models.UGPGGuidance, error) {
	ugpgGuidances := []models.UGPGGuidance{}
	cursor, err := r.collection.Find(context.Background(), bson.M{"thesisTopic": thesisTopic, "userId": userId})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		ugpgGuidance := models.UGPGGuidance{}
		err := cursor.Decode(&ugpgGuidance)
		if err != nil {
			return nil, err
		}
		ugpgGuidances = append(ugpgGuidances, ugpgGuidance)
	}
	return ugpgGuidances, nil
}

func (r *UGPGGuidanceRepo) GetUGPGGuidancesByCreate(start, end primitive.DateTime, userId primitive.ObjectID) ([]models.UGPGGuidance, error) {
	ugpgGuidances := []models.UGPGGuidance{}
	cursor, err := r.collection.Find(context.Background(), bson.M{"createdAt": bson.M{"$gte": start, "$lte": end}, "userId": userId})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		ugpgGuidance := models.UGPGGuidance{}
		err := cursor.Decode(&ugpgGuidance)
		if err != nil {
			return nil, err
		}
		ugpgGuidances = append(ugpgGuidances, ugpgGuidance)
	}
	return ugpgGuidances, nil
}

func (r *UGPGGuidanceRepo) GetUGPGGuidancesByUpdate(start, end primitive.DateTime, userId primitive.ObjectID) ([]models.UGPGGuidance, error) {
	ugpgGuidances := []models.UGPGGuidance{}
	cursor, err := r.collection.Find(context.Background(), bson.M{"updatedAt": bson.M{"$gte": start, "$lte": end}, "userId": userId})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		ugpgGuidance := models.UGPGGuidance{}
		err := cursor.Decode(&ugpgGuidance)
		if err != nil {
			return nil, err
		}
		ugpgGuidances = append(ugpgGuidances, ugpgGuidance)
	}
	return ugpgGuidances, nil
}

func (r *UGPGGuidanceRepo) GetAllUGPGGuidances(userId primitive.ObjectID) ([]models.UGPGGuidance, error) {
	ugpgGuidances := []models.UGPGGuidance{}
	cursor, err := r.collection.Find(context.Background(), bson.M{"userId": userId})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		ugpgGuidance := models.UGPGGuidance{}
		err := cursor.Decode(&ugpgGuidance)
		if err != nil {
			return nil, err
		}
		ugpgGuidances = append(ugpgGuidances, ugpgGuidance)
	}
	return ugpgGuidances, nil
}

func (r *UGPGGuidanceRepo) CreateUGPGGuidance(ugpgGuidance *models.UGPGGuidance) error {
	_, err := r.collection.InsertOne(context.Background(), ugpgGuidance)
	if err != nil {
		return err
	}
	return nil
}

func (r *UGPGGuidanceRepo) UpdateUGPGGuidance(ugpgGuidance *models.UGPGGuidance) error {
	_, err := r.collection.ReplaceOne(context.Background(), bson.M{"_id": ugpgGuidance.ID}, ugpgGuidance)
	if err != nil {
		return err
	}
	return nil
}

func (r *UGPGGuidanceRepo) DeleteUGPGGuidance(id string) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	if err != nil {
		return err
	}
	return nil
}
