package repository

import (
	"context"
	"server/persistence/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MonographRepo struct {
	collection *mongo.Collection
}

type MonoGraphParams struct {
	TeachersIn       []primitive.ObjectID
	TeachersOut      []*string
	Title            *string
	PublishDateStart *time.Time
	PublishDateEnd   *time.Time
	PublishLevel     *string
	Rank             *string
	CreatedAtStart   *time.Time
	CreatedAtEnd     *time.Time
	UpdatedAtStart   *time.Time
	UpdatedAtEnd     *time.Time
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
	if params.Title != nil {
		filter["title"] = bson.M{"$regex": primitive.Regex{Pattern: *params.Title, Options: "i"}}
	}
	// filter for publishDate
	if params.PublishDateStart != nil || params.PublishDateEnd != nil {
		filter["publishDate"] = bson.M{}
		if params.PublishDateStart != nil {
			publishDateStart := primitive.NewDateTimeFromTime(*params.PublishDateStart)
			filter["publishDate"].(bson.M)["$gte"] = publishDateStart
		}
		if params.PublishDateEnd != nil {
			publishDateEnd := primitive.NewDateTimeFromTime(*params.PublishDateEnd)
			filter["publishDate"].(bson.M)["$lte"] = publishDateEnd
		}
	}
	// filter for publishLevel
	if params.PublishLevel != nil {
		filter["publishLevel"] = bson.M{"$regex": primitive.Regex{Pattern: *params.PublishLevel, Options: "i"}}
	}
	// filter for rank
	if params.Rank != nil {
		filter["rank"] = bson.M{"$regex": primitive.Regex{Pattern: *params.Rank, Options: "i"}}
	}
	// filter for createdAt
	if params.CreatedAtStart != nil || params.CreatedAtEnd != nil {
		filter["createdAt"] = bson.M{}
		if params.CreatedAtStart != nil {
			createdStart := primitive.NewDateTimeFromTime(*params.CreatedAtStart)
			filter["createdAt"].(bson.M)["$gte"] = createdStart
		}
		if params.CreatedAtEnd != nil {
			createdEnd := primitive.NewDateTimeFromTime(*params.CreatedAtEnd)
			filter["createdAt"].(bson.M)["$lte"] = createdEnd
		}
	}
	// filter for updatedAt
	if params.UpdatedAtStart != nil || params.UpdatedAtEnd != nil {
		filter["updatedAt"] = bson.M{}
		if params.UpdatedAtStart != nil {
			updatedStart := primitive.NewDateTimeFromTime(*params.UpdatedAtStart)
			filter["updatedAt"].(bson.M)["$gte"] = updatedStart
		}
		if params.UpdatedAtEnd != nil {
			updatedEnd := primitive.NewDateTimeFromTime(*params.UpdatedAtEnd)
			filter["updatedAt"].(bson.M)["$lte"] = updatedEnd
		}
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
	monograph.ID = primitive.NewObjectID()
	ceatedTime := primitive.NewDateTimeFromTime(time.Now())
	monograph.CreatedAt = ceatedTime
	monograph.UpdatedAt = ceatedTime
	result, err := r.collection.InsertOne(context.Background(), monograph)
	if err != nil {
		return nil, err
	}
	newMonograph := result.InsertedID.(primitive.ObjectID)
	return &newMonograph, nil
}

func (r *MonographRepo) UpdateMonograph(monograph *models.Monograph) error {
	monograph.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	_, err := r.collection.UpdateOne(context.Background(), bson.M{"_id": monograph.ID}, bson.M{"$set": monograph})
	return err
}

func (r *MonographRepo) DeleteMonograph(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
