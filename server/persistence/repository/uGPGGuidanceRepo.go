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
	UserId           primitive.ObjectID
	StudentName      *string
	ThesisTopic      *string
	DefenseDateStart *primitive.DateTime
	DefenseDateEnd   *primitive.DateTime
	CreatedStart     *primitive.DateTime
	CreatedEnd       *primitive.DateTime
	UpdatedStart     *primitive.DateTime
	UpdatedEnd       *primitive.DateTime
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
	if params.StudentName != nil {
		filter["studentName"] = bson.M{"$regex": primitive.Regex{Pattern: *params.StudentName, Options: "i"}}
	}
	// filter for thesisTopic
	if params.ThesisTopic != nil {
		filter["thesisTopic"] = bson.M{"$regex": primitive.Regex{Pattern: *params.ThesisTopic, Options: "i"}}
	}
	// filter for defenseDate
	if params.DefenseDateStart != nil || params.DefenseDateEnd != nil {
		filter["defenseDate"] = bson.M{}
		if params.DefenseDateStart != nil {
			filter["defenseDate"].(bson.M)["$gte"] = params.DefenseDateStart
		}
		if params.DefenseDateEnd != nil {
			filter["defenseDate"].(bson.M)["$lte"] = params.DefenseDateEnd
		}
	}
	// filter for created time
	if params.CreatedStart != nil || params.CreatedEnd != nil {
		filter["createdAt"] = bson.M{}
		if params.CreatedStart != nil {
			filter["createdAt"].(bson.M)["$gte"] = params.CreatedStart
		}
		if params.CreatedEnd != nil {
			filter["createdAt"].(bson.M)["$lte"] = params.CreatedEnd
		}
	}
	// filter for updated time
	if params.UpdatedStart != nil || params.UpdatedEnd != nil {
		filter["updatedAt"] = bson.M{}
		if params.UpdatedStart != nil {
			filter["updatedAt"].(bson.M)["$gte"] = params.UpdatedStart
		}
		if params.UpdatedEnd != nil {
			filter["updatedAt"].(bson.M)["$lte"] = params.UpdatedEnd
		}
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
	ugpgGuidance.ID = primitive.NewObjectID()
	createdTime := primitive.NewDateTimeFromTime(time.Now())
	ugpgGuidance.CreatedAt = createdTime
	ugpgGuidance.UpdatedAt = createdTime
	result, err := r.collection.InsertOne(context.Background(), ugpgGuidance)
	if err != nil {
		return nil, err
	}
	newUGPGGuidanceId := result.InsertedID.(primitive.ObjectID)
	return &newUGPGGuidanceId, nil
}

func (r *UGPGGuidanceRepo) UpdateUGPGGuidance(ugpgGuidance *models.UGPGGuidance) error {
	ugpgGuidance.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": ugpgGuidance.ID},
		bson.M{"$set": ugpgGuidance},
	)
	return err
}

func (r *UGPGGuidanceRepo) DeleteUGPGGuidance(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
