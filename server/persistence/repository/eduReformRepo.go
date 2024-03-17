package repository

import (
	"context"
	"server/persistence/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type eduReformRepo struct {
	collection *mongo.Collection
}

type EduReformQueryParams struct {
	TeachersIn  []primitive.ObjectID
	TeachersOut []string
	Number      string
	Title       string
	Achievement string
}

func NewEduReformRepo(db *mongo.Database) *eduReformRepo {
	return &eduReformRepo{
		collection: db.Collection("EduReform"),
	}
}

func (r *eduReformRepo) GetEduReformById(id primitive.ObjectID) (*models.EduReform, error) {
	eduReform := models.EduReform{}
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&eduReform)
	if err != nil {
		return nil, err
	}
	return &eduReform, nil
}

func (r *eduReformRepo) GetEduReformsByParams(params EduReformQueryParams) ([]models.EduReform, error) {
	eduReforms := []models.EduReform{}

	//  filter for teachersIn,can not be empty
	filter := bson.M{"teachersIn": bson.M{"$in": params.TeachersIn}}
	//  filter for teachersOut
	if len(params.TeachersOut) > 0 {
		filter["teachersOut"] = bson.M{"$in": params.TeachersOut}
	}
	// filter for number
	if params.Number != "" {
		filter["number"] = params.Number
	}
	// filter for title
	if params.Title != "" {
		filter["title"] = params.Title
	}
	// filter for achievement
	if params.Achievement != "" {
		filter["achievement"] = params.Achievement
	}
	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		eduReform := models.EduReform{}
		err := cursor.Decode(&eduReform)
		if err != nil {
			return nil, err
		}
		eduReforms = append(eduReforms, eduReform)
	}
	return eduReforms, nil
}

func (r *eduReformRepo) CreateEduReform(eduReform *models.EduReform) (*primitive.ObjectID, error) {
	result, err := r.collection.InsertOne(context.Background(), eduReform)
	if err != nil {
		return nil, err
	}
	newEduReform := result.InsertedID.(primitive.ObjectID)
	return &newEduReform, nil
}

func (r *eduReformRepo) UpdateEduReform(eduReform *models.EduReform) error {
	_, err := r.collection.UpdateOne(context.Background(), bson.M{"_id": eduReform.ID}, bson.M{"$set": eduReform})
	return err
}

func (r *eduReformRepo) DeleteEduReform(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
