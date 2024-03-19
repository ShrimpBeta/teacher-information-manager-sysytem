package repository

import (
	"context"
	"server/persistence/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ClassScheduleRepo struct {
	collection *mongo.Collection
}

func NewClassScheduleRepo(db *mongo.Database) *ClassScheduleRepo {
	return &ClassScheduleRepo{
		collection: db.Collection("ClassSchedule"),
	}
}

func (r *ClassScheduleRepo) GetAcademicTermById(id primitive.ObjectID) (*models.AcademicTerm, error) {
	academicTerm := models.AcademicTerm{}
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&academicTerm)
	if err != nil {
		return nil, err
	}
	return &academicTerm, nil
}

func (r *ClassScheduleRepo) GetAcademicTermsByUserId(userId primitive.ObjectID) ([]models.AcademicTerm, error) {
	academicTerms := []models.AcademicTerm{}
	cursor, err := r.collection.Find(context.Background(), bson.M{"userId": userId})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		academicTerm := models.AcademicTerm{}
		err := cursor.Decode(&academicTerm)
		if err != nil {
			return nil, err
		}
		academicTerms = append(academicTerms, academicTerm)
	}
	return academicTerms, nil
}

func (r *ClassScheduleRepo) CreateAcademicTerm(academicTerm *models.AcademicTerm) (*primitive.ObjectID, error) {
	result, err := r.collection.InsertOne(context.Background(), academicTerm)
	if err != nil {
		return nil, err
	}
	newAcademicTermId := result.InsertedID.(primitive.ObjectID)
	return &newAcademicTermId, nil
}

func (r *ClassScheduleRepo) UpdateAcademicTerm(academicTerm *models.AcademicTerm) error {
	_, err := r.collection.UpdateOne(context.Background(), bson.M{"_id": academicTerm.ID}, bson.M{"$set": academicTerm})
	return err
}

func (r *ClassScheduleRepo) DeleteAcademicTerm(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
