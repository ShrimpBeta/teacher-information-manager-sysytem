package repository

import (
	"context"
	"server/persistence/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MentorshipRepo struct {
	collection *mongo.Collection
}

type MentorshipQueryParams struct {
	UserId      primitive.ObjectID
	ProjectName string
}

func MewMentorshipRepo(db *mongo.Database) *MentorshipRepo {
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
	if params.ProjectName != "" {
		filter["projectName"] = params.ProjectName
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
	result, err := r.collection.InsertOne(context.Background(), mentorship)
	if err != nil {
		return nil, err
	}
	newMentorship := result.InsertedID.(primitive.ObjectID)
	return &newMentorship, nil
}

func (r *MentorshipRepo) UpdateMentorship(mentorship *models.Mentorship) error {
	_, err := r.collection.UpdateOne(context.Background(), bson.M{"_id": mentorship.ID}, bson.M{"$set": mentorship})
	return err
}

func (r *MentorshipRepo) DeleteMentorship(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
