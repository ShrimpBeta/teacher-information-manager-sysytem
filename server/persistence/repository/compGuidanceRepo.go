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
	UserId        primitive.ObjectID
	ProjectName   *string
	StudentNames  []*string
	GuidanceStart *primitive.DateTime
	GuidanceEnd   *primitive.DateTime
	AwardStatus   *string
	CreatedStart  *primitive.DateTime
	CreatedEnd    *primitive.DateTime
	UpdatedStart  *primitive.DateTime
	UpdatedEnd    *primitive.DateTime
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
	if params.ProjectName != nil {
		filter["projectName"] = bson.M{"$regex": primitive.Regex{Pattern: *params.ProjectName, Options: "i"}}
	}
	// filter for studentNames
	if params.StudentNames != nil {
		filter["studentNames"] = bson.M{"$in": params.StudentNames}
	}
	// filter for guidanceDate
	if params.GuidanceStart != nil || params.GuidanceEnd != nil {
		filter["guidanceDate"] = bson.M{}
		if params.GuidanceStart != nil {
			filter["guidanceDate"].(bson.M)["$gte"] = *params.GuidanceStart
		}
		if params.GuidanceEnd != nil {
			filter["guidanceDate"].(bson.M)["$lte"] = *params.GuidanceEnd
		}
	}
	// filter for awardStatus
	if params.AwardStatus != nil {
		filter["awardStatus"] = bson.M{"$regex": primitive.Regex{Pattern: *params.AwardStatus, Options: "i"}}
	}
	// filter for createdAt
	if params.CreatedStart != nil || params.CreatedEnd != nil {
		filter["createdAt"] = bson.M{}
		if params.CreatedStart != nil {
			filter["createdAt"].(bson.M)["$gte"] = *params.CreatedStart
		}
		if params.CreatedEnd != nil {
			filter["createdAt"].(bson.M)["$lte"] = *params.CreatedEnd
		}
	}
	// filter for updatedAt
	if params.UpdatedStart != nil || params.UpdatedEnd != nil {
		filter["updatedAt"] = bson.M{}
		if params.UpdatedStart != nil {
			filter["updatedAt"].(bson.M)["$gte"] = *params.UpdatedStart
		}
		if params.UpdatedEnd != nil {
			filter["updatedAt"].(bson.M)["$lte"] = *params.UpdatedEnd
		}
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
	compGuidance.ID = primitive.NewObjectID()
	createdTime := primitive.NewDateTimeFromTime(time.Now())
	compGuidance.CreatedAt = createdTime
	compGuidance.UpdatedAt = createdTime
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
