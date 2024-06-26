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
	UserId            primitive.ObjectID
	ProjectName       *string
	StudentNames      []*string
	GuidanceDateStart *time.Time
	GuidanceDateEnd   *time.Time
	AwardStatus       *string
	CreatedStart      *time.Time
	CreatedEnd        *time.Time
	UpdatedStart      *time.Time
	UpdatedEnd        *time.Time
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
		filter["studentNames"] = bson.M{"$all": params.StudentNames}
	}
	// filter for guidanceDate
	if params.GuidanceDateStart != nil || params.GuidanceDateEnd != nil {
		filter["guidanceDate"] = bson.M{}
		if params.GuidanceDateStart != nil {
			guidanceDateStart := primitive.NewDateTimeFromTime(*params.GuidanceDateStart)
			filter["guidanceDate"].(bson.M)["$gte"] = guidanceDateStart
		}
		if params.GuidanceDateEnd != nil {
			guidanceDateEnd := primitive.NewDateTimeFromTime(*params.GuidanceDateEnd)
			filter["guidanceDate"].(bson.M)["$lte"] = guidanceDateEnd
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
			createdStart := primitive.NewDateTimeFromTime(*params.CreatedStart)
			filter["createdAt"].(bson.M)["$gte"] = createdStart
		}
		if params.CreatedEnd != nil {
			createdEnd := primitive.NewDateTimeFromTime(*params.CreatedEnd)
			filter["createdAt"].(bson.M)["$lte"] = createdEnd
		}
	}
	// filter for updatedAt
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

	// fmt.Println(filter)

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
	_, err := r.collection.ReplaceOne(context.Background(), bson.M{"_id": compGuidance.ID}, compGuidance)
	return err
}

func (r *CompGuidanceRepo) DeleteCompGuidance(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}

func (r *CompGuidanceRepo) GetCompGuidanceReports(ids []primitive.ObjectID, startDate, endDate time.Time) ([]models.CompGuidanceReport, error) {
	compGuidanceReports := []models.CompGuidanceReport{}

	filter := bson.M{
		"userId": bson.M{"$in": ids},
		"guidanceDate": bson.M{
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
		compGuidance := models.CompGuidance{}
		err := cursor.Decode(&compGuidance)
		if err != nil {
			return nil, err
		}
		compGuidanceReports = append(compGuidanceReports, models.CompGuidanceReport{
			UserId:       compGuidance.UserId,
			ProjectName:  compGuidance.ProjectName,
			GuidanceDate: compGuidance.GuidanceDate,
		})
	}
	return compGuidanceReports, nil
}
