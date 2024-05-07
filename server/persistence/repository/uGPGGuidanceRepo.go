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
	DefenseDateStart *time.Time
	DefenseDateEnd   *time.Time
	CreatedStart     *time.Time
	CreatedEnd       *time.Time
	UpdatedStart     *time.Time
	UpdatedEnd       *time.Time
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
			defenseDateStart := primitive.NewDateTimeFromTime(*params.DefenseDateStart)
			filter["defenseDate"].(bson.M)["$gte"] = defenseDateStart
		}
		if params.DefenseDateEnd != nil {
			defenseDateEnd := primitive.NewDateTimeFromTime(*params.DefenseDateEnd)
			filter["defenseDate"].(bson.M)["$lte"] = defenseDateEnd
		}
	}
	// filter for created time
	if params.CreatedStart != nil || params.CreatedEnd != nil {
		filter["createdAt"] = bson.M{}
		if params.CreatedStart != nil {
			createdStart := primitive.NewDateTimeFromTime(*params.CreatedStart)
			filter["createdAt"].(bson.M)["$gte"] = createdStart
		}
		if params.CreatedEnd != nil {
			createdEnd := primitive.NewDateTimeFromTime(*params.CreatedEnd)
			filter["createdAt"].(bson.M)["$lte"] = createdEnd
		}
	}
	// filter for updated time
	if params.UpdatedStart != nil || params.UpdatedEnd != nil {
		filter["updatedAt"] = bson.M{}
		if params.UpdatedStart != nil {
			updatedStart := primitive.NewDateTimeFromTime(*params.UpdatedStart)
			filter["updatedAt"].(bson.M)["$gte"] = updatedStart
		}
		if params.UpdatedEnd != nil {
			updatedEnd := primitive.NewDateTimeFromTime(*params.UpdatedEnd)
			filter["updatedAt"].(bson.M)["$lte"] = updatedEnd
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
	_, err := r.collection.ReplaceOne(
		context.Background(),
		bson.M{"_id": ugpgGuidance.ID},
		ugpgGuidance,
	)
	return err
}

func (r *UGPGGuidanceRepo) DeleteUGPGGuidance(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}

func (r *UGPGGuidanceRepo) GetUGPGGuidanceReports(ids []primitive.ObjectID, startDate, endDate time.Time) ([]models.UGPGGuidanceReport, error) {
	ugpgGuidanceReports := []models.UGPGGuidanceReport{}
	filter := bson.M{
		"userId": bson.M{
			"$in": ids,
		},
		"defenseDate": bson.M{
			"$gte": primitive.NewDateTimeFromTime(startDate),
			"$lte": primitive.NewDateTimeFromTime(endDate),
		},
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
		ugpgGuidanceReports = append(ugpgGuidanceReports, models.UGPGGuidanceReport{
			UserId:      ugpgGuidance.UserId,
			ThesisTopic: ugpgGuidance.ThesisTopic,
			DefenseDate: ugpgGuidance.DefenseDate,
		})
	}
	return ugpgGuidanceReports, nil
}
