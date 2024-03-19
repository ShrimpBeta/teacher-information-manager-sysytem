package repository

import (
	"context"
	"server/persistence/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type PaperRepo struct {
	collection *mongo.Collection
}

type PaperQueryParams struct {
	TeachersIn  []primitive.ObjectID
	TeachersOut []string
	Title       string
	JournalName string
}

func NewPaperRepo(db *mongo.Database) *PaperRepo {
	return &PaperRepo{
		collection: db.Collection("Paper"),
	}
}

func (r *PaperRepo) GetPaperById(id primitive.ObjectID) (*models.Paper, error) {
	paper := models.Paper{}
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&paper)
	if err != nil {
		return nil, err
	}
	return &paper, nil
}

func (r *PaperRepo) GetPapersByParams(params PaperQueryParams) ([]models.Paper, error) {
	papers := []models.Paper{}

	//  filter for teachersIn,can not be empty
	filter := bson.M{"teachersIn": bson.M{"$in": params.TeachersIn}}
	//  filter for teachersOut
	if len(params.TeachersOut) > 0 {
		filter["teachersOut"] = bson.M{"$in": params.TeachersOut}
	}
	// filter for title
	if params.Title != "" {
		filter["title"] = params.Title
	}
	// filter for journalName
	if params.JournalName != "" {
		filter["journalName"] = params.JournalName
	}
	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		paper := models.Paper{}
		err := cursor.Decode(&paper)
		if err != nil {
			return nil, err
		}
		papers = append(papers, paper)
	}
	return papers, nil
}

func (r *PaperRepo) CreatePaper(paper *models.Paper) (*primitive.ObjectID, error) {
	objectId := primitive.NewObjectID()
	paper.ID = objectId
	paper.CreatedAt = primitive.NewDateTimeFromTime(paper.CreatedAt.Time())
	paper.UpdatedAt = primitive.NewDateTimeFromTime(paper.UpdatedAt.Time())
	result, err := r.collection.InsertOne(context.Background(), paper)
	if err != nil {
		return nil, err
	}
	newPaperId := result.InsertedID.(primitive.ObjectID)
	return &newPaperId, nil
}

func (r *PaperRepo) UpdatePaper(paper *models.Paper) error {
	paper.UpdatedAt = primitive.NewDateTimeFromTime(paper.UpdatedAt.Time())
	_, err := r.collection.UpdateOne(context.Background(), bson.M{"_id": paper.ID}, bson.M{"$set": paper})
	return err
}

func (r *PaperRepo) DeletePaper(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
