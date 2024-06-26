package repository

import (
	"context"
	"server/persistence/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type PasswordRepo struct {
	collection *mongo.Collection
}

type PasswordQueryParams struct {
	UserId  primitive.ObjectID
	Url     *string
	AppName *string
	Account *string
}

func NewPasswordRepo(db *mongo.Database) *PasswordRepo {
	return &PasswordRepo{
		collection: db.Collection("Password"),
	}
}

func (r *PasswordRepo) GetPasswordById(id primitive.ObjectID) (*models.Password, error) {
	password := models.Password{}
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&password)
	if err != nil {
		return nil, err
	}
	return &password, nil
}

func (r *PasswordRepo) GetPasswordsByIds(ids []primitive.ObjectID) ([]models.Password, error) {
	passwords := []models.Password{}
	cursor, err := r.collection.Find(context.Background(), bson.M{"_id": bson.M{"$in": ids}})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		password := models.Password{}
		err := cursor.Decode(&password)
		if err != nil {
			return nil, err
		}
		passwords = append(passwords, password)
	}

	return passwords, nil
}

func (r *PasswordRepo) GetPasswordsByParams(params PasswordQueryParams) ([]models.Password, error) {
	passwords := []models.Password{}

	// filter for userId, can not be empty
	filter := bson.M{
		"$and": []bson.M{
			{"userId": params.UserId},
		},
	}

	optionalFilters := []bson.M{}

	// filter for url
	if params.Url != nil {
		optionalFilters = append(optionalFilters, bson.M{"url": bson.M{"$regex": primitive.Regex{Pattern: *params.Url, Options: "i"}}})
	}
	// filter for appName
	if params.AppName != nil {
		optionalFilters = append(optionalFilters, bson.M{"appName": bson.M{"$regex": primitive.Regex{Pattern: *params.AppName, Options: "i"}}})
	}
	// filter for account
	if params.Account != nil {
		optionalFilters = append(optionalFilters, bson.M{"account": bson.M{"$regex": primitive.Regex{Pattern: *params.Account, Options: "i"}}})
	}

	if len(optionalFilters) > 0 {
		filter["$and"] = append(filter["$and"].([]bson.M), bson.M{"$or": optionalFilters})
	}

	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var password models.Password
		if err := cursor.Decode(&password); err != nil {
			return nil, err
		}
		passwords = append(passwords, password)
	}
	return passwords, nil
}

func (r *PasswordRepo) CreatePassword(password *models.Password) (*primitive.ObjectID, error) {
	password.ID = primitive.NewObjectID()
	password.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	password.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	result, err := r.collection.InsertOne(context.Background(), password)
	if err != nil {
		return nil, err
	}
	newPasswordId := result.InsertedID.(primitive.ObjectID)
	return &newPasswordId, nil
}

func (r *PasswordRepo) UpdatePassword(password *models.Password) error {
	password.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	_, err := r.collection.ReplaceOne(
		context.Background(),
		bson.M{"_id": password.ID},
		password,
	)
	return err
}

func (r *PasswordRepo) DeletePassword(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
