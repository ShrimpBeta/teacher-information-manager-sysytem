package repository

import (
	"context"
	"server/persistence/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type EduReformRepo struct {
	collection *mongo.Collection
}

type EduReformQueryParams struct {
	TeachersIn     []primitive.ObjectID
	TeachersOut    []*string
	Number         *string
	Title          *string
	StartDateStart *time.Time
	StartDateEnd   *time.Time
	Level          *string
	Rank           *string
	Achievement    *string
	Fund           *string
	CreatedAtStart *time.Time
	CreatedAtEnd   *time.Time
	UpdatedAtStart *time.Time
	UpdatedAtEnd   *time.Time
}

func NewEduReformRepo(db *mongo.Database) *EduReformRepo {
	return &EduReformRepo{
		collection: db.Collection("EduReform"),
	}
}

func (r *EduReformRepo) GetEduReformById(id primitive.ObjectID) (*models.EduReform, error) {
	eduReform := models.EduReform{}
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&eduReform)
	if err != nil {
		return nil, err
	}
	return &eduReform, nil
}

func (r *EduReformRepo) GetEduReformsByParams(params EduReformQueryParams) ([]models.EduReform, error) {
	eduReforms := []models.EduReform{}

	//  filter for teachersIn,can not be empty
	filter := bson.M{"teachersIn": bson.M{"$all": params.TeachersIn}}
	//  filter for teachersOut
	if len(params.TeachersOut) > 0 {
		filter["teachersOut"] = bson.M{"$all": params.TeachersOut}
	}
	// filter for number
	if params.Number != nil {
		filter["number"] = *params.Number
	}
	// filter for title
	if params.Title != nil {
		filter["title"] = bson.M{"$regex": primitive.Regex{Pattern: *params.Title, Options: "i"}}
	}
	// filter for startDate
	if params.StartDateStart != nil || params.StartDateEnd != nil {
		filter["startDate"] = bson.M{}
		if params.StartDateStart != nil {
			startDateStart := primitive.NewDateTimeFromTime(*params.StartDateStart)
			filter["startDate"].(bson.M)["$gte"] = startDateStart
		}
		if params.StartDateEnd != nil {
			startDateEnd := primitive.NewDateTimeFromTime(*params.StartDateEnd)
			filter["startDate"].(bson.M)["$lte"] = startDateEnd
		}
	}
	// filter for level
	if params.Level != nil {
		filter["level"] = bson.M{"$regex": primitive.Regex{Pattern: *params.Level, Options: "i"}}
	}
	// filter for rank
	if params.Rank != nil {
		filter["rank"] = bson.M{"$regex": primitive.Regex{Pattern: *params.Rank, Options: "i"}}
	}
	// filter for achievement
	if params.Achievement != nil {
		filter["achievement"] = bson.M{"$regex": primitive.Regex{Pattern: *params.Achievement, Options: "i"}}
	}
	// filter for fund
	if params.Fund != nil {
		filter["fund"] = bson.M{"$regex": primitive.Regex{Pattern: *params.Fund, Options: "i"}}
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
		eduReform := models.EduReform{}
		err := cursor.Decode(&eduReform)
		if err != nil {
			return nil, err
		}
		eduReforms = append(eduReforms, eduReform)
	}
	return eduReforms, nil
}

func (r *EduReformRepo) CreateEduReform(eduReform *models.EduReform) (*primitive.ObjectID, error) {
	eduReform.ID = primitive.NewObjectID()
	createdTime := primitive.NewDateTimeFromTime(time.Now())
	eduReform.CreatedAt = createdTime
	eduReform.UpdatedAt = createdTime
	result, err := r.collection.InsertOne(context.Background(), eduReform)
	if err != nil {
		return nil, err
	}
	newEduReform := result.InsertedID.(primitive.ObjectID)
	return &newEduReform, nil
}

func (r *EduReformRepo) UpdateEduReform(eduReform *models.EduReform) error {
	eduReform.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	_, err := r.collection.ReplaceOne(
		context.Background(),
		bson.M{"_id": eduReform.ID},
		eduReform,
	)
	return err
}

func (r *EduReformRepo) DeleteEduReform(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}

func (r *EduReformRepo) GetEduReformReports(ids []primitive.ObjectID, startDate, endDate time.Time) ([]models.EduReformReport, error) {
	eduReformReports := []models.EduReformReport{}
	filter := bson.M{
		"teachersIn": bson.M{"$in": ids},
		"startDate": bson.M{
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
		eduReform := models.EduReform{}
		err := cursor.Decode(&eduReform)
		if err != nil {
			return nil, err
		}
		eduReformReports = append(eduReformReports, models.EduReformReport{
			TeachersIn: eduReform.TeachersIn,
			Title:      eduReform.Title,
			StartDate:  eduReform.StartDate,
		})
	}
	return eduReformReports, nil
}
