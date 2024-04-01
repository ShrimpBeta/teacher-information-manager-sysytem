package repository

import (
	"context"
	"server/persistence/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MentorshipRepo struct {
	collection *mongo.Collection
}

type MentorshipQueryParams struct {
	UserId            primitive.ObjectID
	ProjectName       *string
	StudentNames      []*string
	Grade             *string
	GuidanceDateStart *primitive.DateTime
	GuidanceDateEnd   *primitive.DateTime
	CreatedAtStart    *primitive.DateTime
	CreatedAtEnd      *primitive.DateTime
	UpdatedAtStart    *primitive.DateTime
	UpdatedAtEnd      *primitive.DateTime
}

func NewMentorshipRepo(db *mongo.Database) *MentorshipRepo {
	return &MentorshipRepo{
		collection: db.Collection("Mentorship"),
	}
}

func (r *MentorshipRepo) GetMentorshipById(id primitive.ObjectID) (*models.Mentorship, error) {
	mentorship := models.Mentorship{}
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&mentorship)
	if err != nil {
		return nil, err
	}
	return &mentorship, nil
}

func (r *MentorshipRepo) GetMentorshipsByParams(params MentorshipQueryParams) ([]models.Mentorship, error) {
	mentorships := []models.Mentorship{}

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
	// filter for grade
	if params.Grade != nil {
		filter["grade"] = *params.Grade
	}
	// filter for guidanceDate
	if params.GuidanceDateStart != nil || params.GuidanceDateEnd != nil {
		filter["guidanceDate"] = bson.M{}
		if params.GuidanceDateStart != nil {
			filter["guidanceDate"].(bson.M)["$gte"] = params.GuidanceDateStart
		}
		if params.GuidanceDateEnd != nil {
			filter["guidanceDate"].(bson.M)["$lte"] = params.GuidanceDateEnd
		}
	}
	// filter for createdAt
	if params.CreatedAtStart != nil || params.CreatedAtEnd != nil {
		filter["createdAt"] = bson.M{}
		if params.CreatedAtStart != nil {
			filter["createdAt"].(bson.M)["$gte"] = params.CreatedAtStart
		}
		if params.CreatedAtEnd != nil {
			filter["createdAt"].(bson.M)["$lte"] = params.CreatedAtEnd
		}
	}
	// filter for updatedAt
	if params.UpdatedAtStart != nil || params.UpdatedAtEnd != nil {
		filter["updatedAt"] = bson.M{}
		if params.UpdatedAtStart != nil {
			filter["updatedAt"].(bson.M)["$gte"] = params.UpdatedAtStart
		}
		if params.UpdatedAtEnd != nil {
			filter["updatedAt"].(bson.M)["$lte"] = params.UpdatedAtEnd
		}
	}

	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		mentorship := models.Mentorship{}
		err := cursor.Decode(&mentorship)
		if err != nil {
			return nil, err
		}
		mentorships = append(mentorships, mentorship)
	}
	return mentorships, nil
}

func (r *MentorshipRepo) CreateMentorship(mentorship *models.Mentorship) (*primitive.ObjectID, error) {
	mentorship.ID = primitive.NewObjectID()
	createdTime := primitive.NewDateTimeFromTime(time.Now())
	mentorship.CreatedAt = createdTime
	mentorship.UpdatedAt = createdTime
	result, err := r.collection.InsertOne(context.Background(), mentorship)
	if err != nil {
		return nil, err
	}
	newMentorship := result.InsertedID.(primitive.ObjectID)
	return &newMentorship, nil
}

func (r *MentorshipRepo) UpdateMentorship(mentorship *models.Mentorship) error {
	mentorship.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": mentorship.ID},
		bson.M{"$set": mentorship},
	)
	return err
}

func (r *MentorshipRepo) DeleteMentorship(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
