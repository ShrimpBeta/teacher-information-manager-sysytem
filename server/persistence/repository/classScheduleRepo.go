package repository

import (
	"context"
	"server/persistence/models"
	"time"

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
	academicTerm.ID = primitive.NewObjectID()
	createdTime := primitive.NewDateTimeFromTime(time.Now())
	academicTerm.CreatedAt = createdTime
	academicTerm.UpdatedAt = createdTime

	if academicTerm.Courses != nil {
		for i := range academicTerm.Courses {
			academicTerm.Courses[i].ID = primitive.NewObjectID()
		}
	}

	result, err := r.collection.InsertOne(context.Background(), academicTerm)
	if err != nil {
		return nil, err
	}
	newAcademicTermId := result.InsertedID.(primitive.ObjectID)
	return &newAcademicTermId, nil
}

func (r *ClassScheduleRepo) UpdateAcademicTermName(termId primitive.ObjectID, name string) error {
	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": termId},
		bson.M{
			"$set": bson.M{"name": name, "updatedAt": primitive.NewDateTimeFromTime(time.Now())},
		},
	)
	return err
}

func (r *ClassScheduleRepo) DeleteAcademicTerm(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(
		context.Background(),
		bson.M{"_id": id},
	)
	return err
}

func (r *ClassScheduleRepo) CreateCourse(termId primitive.ObjectID, course *models.Course) (*primitive.ObjectID, error) {
	course.ID = primitive.NewObjectID()
	createdTime := primitive.NewDateTimeFromTime(time.Now())
	result, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": termId},
		bson.M{
			"$push": bson.M{"courses": course},
			"$set":  bson.M{"updatedAt": createdTime},
		},
	)
	if err != nil {
		return nil, err
	}
	newCourseId := result.UpsertedID.(primitive.ObjectID)
	return &newCourseId, nil
}

func (r *ClassScheduleRepo) UpdateCourse(termId primitive.ObjectID, course *models.Course) error {
	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": termId, "courses._id": course.ID},
		bson.M{
			"$set": bson.M{"courses.$": course, "updatedAt": primitive.NewDateTimeFromTime(time.Now())},
		},
	)
	return err
}

func (r *ClassScheduleRepo) DeleteCourse(termId primitive.ObjectID, courseId primitive.ObjectID) error {
	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": termId},
		bson.M{
			"$pull": bson.M{"courses": bson.M{"_id": courseId}},
			"$set":  bson.M{"updatedAt": primitive.NewDateTimeFromTime(time.Now())},
		},
	)
	return err
}
