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
	StartDateStart *primitive.DateTime
	StartDateEnd   *primitive.DateTime
	Level          *string
	Rank           *string
	Achievement    *string
	Fund           *string
	CreatedAtStart *primitive.DateTime
	CreatedAtEnd   *primitive.DateTime
	UpdatedAtStart *primitive.DateTime
	UpdatedAtEnd   *primitive.DateTime
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
	filter := bson.M{"teachersIn": bson.M{"$in": params.TeachersIn}}
	//  filter for teachersOut
	if len(params.TeachersOut) > 0 {
		filter["teachersOut"] = bson.M{"$in": params.TeachersOut}
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
			filter["startDate"].(bson.M)["$gte"] = *params.StartDateStart
		}
		if params.StartDateEnd != nil {
			filter["startDate"].(bson.M)["$lte"] = *params.StartDateEnd
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
			filter["createdAt"].(bson.M)["$gte"] = *params.CreatedAtStart
		}
		if params.CreatedAtEnd != nil {
			filter["createdAt"].(bson.M)["$lte"] = *params.CreatedAtEnd
		}
	}
	// filter for updatedAt
	if params.UpdatedAtStart != nil || params.UpdatedAtEnd != nil {
		filter["updatedAt"] = bson.M{}
		if params.UpdatedAtStart != nil {
			filter["updatedAt"].(bson.M)["$gte"] = *params.UpdatedAtStart
		}
		if params.UpdatedAtEnd != nil {
			filter["updatedAt"].(bson.M)["$lte"] = *params.UpdatedAtEnd
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
	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": eduReform.ID},
		bson.M{"$set": eduReform},
	)
	return err
}

func (r *EduReformRepo) DeleteEduReform(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
