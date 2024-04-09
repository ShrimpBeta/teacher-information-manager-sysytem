package repository

import (
	"context"
	graphql_models "server/graph/model"
	"server/persistence/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepo struct {
	collection *mongo.Collection
}

func NewUserRepo(db *mongo.Database) *UserRepo {
	return &UserRepo{
		collection: db.Collection("User"),
	}
}

func (r *UserRepo) GetUserByEmail(email string) (*models.User, error) {
	user := models.User{}
	err := r.collection.FindOne(context.Background(), bson.M{"email": email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// no user found
			return nil, nil
		}
		// other error
		return nil, err
	}
	return &user, nil
}

func (r *UserRepo) GetUserById(id primitive.ObjectID) (*models.User, error) {
	user := models.User{}
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepo) GetUsersByIds(ids []primitive.ObjectID) ([]models.User, error) {
	users := []models.User{}
	cursor, err := r.collection.Find(context.Background(), bson.M{"_id": bson.M{"$in": ids}})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		user := models.User{}
		err := cursor.Decode(&user)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func (r *UserRepo) GetUsersExportByIds(ids []primitive.ObjectID) ([]*graphql_models.UserExport, error) {
	usersIn, err := r.GetUsersByIds(ids)
	if err != nil {
		return nil, err
	}

	usersExport := make([]*graphql_models.UserExport, len(usersIn))
	for i, user := range usersIn {
		usersExport[i] = &graphql_models.UserExport{
			ID:       user.ID.Hex(),
			Username: user.Username,
			Email:    user.Email,
			Avatar:   user.Avatar,
		}
	}
	return usersExport, nil
}

func (r *UserRepo) GetAllUsers() ([]models.User, error) {
	users := []models.User{}
	cursor, err := r.collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		user := models.User{}
		err := cursor.Decode(&user)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, nil
}

func (r *UserRepo) CreateUser(user *models.User) (*primitive.ObjectID, error) {
	objectId := primitive.NewObjectID()
	user.ID = objectId
	createdTime := primitive.NewDateTimeFromTime(time.Now())
	user.CreatedAt = createdTime
	user.UpdatedAt = createdTime
	result, err := r.collection.InsertOne(context.Background(), user)
	if err != nil {
		return nil, err
	}
	newUserId := result.InsertedID.(primitive.ObjectID)
	return &newUserId, nil
}

func (r *UserRepo) UpdateUser(user *models.User) error {
	user.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	_, err := r.collection.UpdateOne(context.Background(), bson.M{"_id": user.ID}, bson.M{"$set": user})
	return err
}

func (r *UserRepo) DeleteUser(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
