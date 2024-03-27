package repository

import (
	"context"
	"time"

	"server/persistence/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CompGuidanceRepo struct {
	collection *mongo.Collection
}

type CompGuidanceQueryParams struct {
	UserId      primitive.ObjectID
	ProjectName string
	AwardStatus string
}

func NewCompGuidanceRepo(db *mongo.Database) *CompGuidanceRepo {
	return &CompGuidanceRepo{
		collection: db.Collection("CompGuidance"),
	}
}

func (r *CompGuidanceRepo) GetCompGuidanceById(id primitive.ObjectID) (*models.CompGuidance, error) {
	compGuidance := models.CompGuidance{}
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&compGuidance)
	if err != nil {
		return nil, err
	}
	return &compGuidance, nil
}

func (r *CompGuidanceRepo) GetCompGuidancesByParams(params CompGuidanceQueryParams) ([]models.CompGuidance, error) {
	compGuidances := []models.CompGuidance{}

	// filter for userId, can not be empty
	filter := bson.M{"userId": params.UserId}
	// filter for projectName
	if params.ProjectName != "" {
		filter["projectName"] = params.ProjectName
	}
	// filter for awardStatus
	if params.AwardStatus != "" {
		filter["awardStatus"] = params.AwardStatus
	}

	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		compGuidance := models.CompGuidance{}
		err := cursor.Decode(&compGuidance)
		if err != nil {
			return nil, err
		}
		compGuidances = append(compGuidances, compGuidance)
	}
	return compGuidances, nil
}

func (r *CompGuidanceRepo) CratedCompGuidance(compGuidance *models.CompGuidance) (*primitive.ObjectID, error) {
	objectId := primitive.NewObjectID()
	compGuidance.ID = objectId
	compGuidance.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	compGuidance.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	result, err := r.collection.InsertOne(context.Background(), compGuidance)
	if err != nil {
		return nil, err
	}
	newCompGuidance := result.InsertedID.(primitive.ObjectID)
	return &newCompGuidance, nil
}

func (r *CompGuidanceRepo) UpdateCompGuidance(compGuidance *models.CompGuidance) error {
	compGuidance.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	_, err := r.collection.UpdateOne(context.Background(), bson.M{"_id": compGuidance.ID}, bson.M{"$set": compGuidance})
	return err
}

func (r *CompGuidanceRepo) DeleteCompGuidance(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
