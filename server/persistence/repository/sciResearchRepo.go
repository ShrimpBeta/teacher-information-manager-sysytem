package repository

import (
	"context"
	"server/persistence/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type SciResearchRepo struct {
	collection *mongo.Collection
}

func NewSciResearchRepo(db *mongo.Database) *SciResearchRepo {
	return &SciResearchRepo{
		collection: db.Collection("SciResearch"),
	}
}

type AwardRecordRepo struct {
	collection *mongo.Collection
}

func NewAwardRecordRepo(db *mongo.Database) *AwardRecordRepo {
	return &AwardRecordRepo{
		collection: db.Collection("AwardRecord"),
	}
}

type SciResearchQueryParams struct {
	TeachersIn  []primitive.ObjectID
	TeachersOut []string
	Number      string
	Title       string
	Achievement string
	IsAward     string
}

func (r *SciResearchRepo) GetSciResearchById(id primitive.ObjectID) (*models.SciResearch, error) {
	sciResearch := models.SciResearch{}
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&sciResearch)
	if err != nil {
		return nil, err
	}
	return &sciResearch, nil
}

func (r *AwardRecordRepo) GetAwardRecordById(id primitive.ObjectID) (*models.AwardRecord, error) {
	awardRecord := models.AwardRecord{}
	err := r.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&awardRecord)
	if err != nil {
		return nil, err
	}
	return &awardRecord, nil
}

func (r *SciResearchRepo) GetSciResearchsByParams(params SciResearchQueryParams) ([]models.SciResearch, error) {
	sciResearchs := []models.SciResearch{}

	// filter for teachersIn, can not be empty
	filter := bson.M{"teachersIn": bson.M{"$in": params.TeachersIn}}
	// filter for teachersOut
	if len(params.TeachersOut) > 0 {
		filter["teachersOut"] = bson.M{"$in": params.TeachersOut}
	}
	// filter for number
	if params.Number != "" {
		filter["number"] = params.Number
	}
	// filter for title
	if params.Title != "" {
		filter["title"] = params.Title
	}
	// filter for achievement
	if params.Achievement != "" {
		filter["achievement"] = params.Achievement
	}
	// filter for isAward
	if params.IsAward != "" {
		if params.IsAward == "true" {
			filter["isAward"] = true
		} else if params.IsAward == "false" {
			filter["isAward"] = false
		}
	}

	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var sciResearch models.SciResearch
		err := cursor.Decode(&sciResearch)
		if err != nil {
			return nil, err
		}
		sciResearchs = append(sciResearchs, sciResearch)
	}
	return sciResearchs, nil
}

func (r *SciResearchRepo) CreateSciResearch(sciResearch *models.SciResearch) (*primitive.ObjectID, error) {
	result, err := r.collection.InsertOne(context.Background(), sciResearch)
	if err != nil {
		return nil, err
	}
	newSciResearchId := result.InsertedID.(primitive.ObjectID)
	return &newSciResearchId, nil
}

func (r *AwardRecordRepo) CreateAwardRecord(awardRecord *models.AwardRecord) (*primitive.ObjectID, error) {
	result, err := r.collection.InsertOne(context.Background(), awardRecord)
	if err != nil {
		return nil, err
	}

	newAwardRecordId := result.InsertedID.(primitive.ObjectID)
	return &newAwardRecordId, nil
}

func (r *SciResearchRepo) UpdateSciResearch(sciResearch *models.SciResearch) error {
	_, err := r.collection.UpdateOne(context.Background(), bson.M{"_id": sciResearch.ID}, bson.M{"$set": sciResearch})
	return err
}

func (r *AwardRecordRepo) UpdateAwardRecord(awardRecord *models.AwardRecord) error {
	_, err := r.collection.UpdateOne(context.Background(), bson.M{"_id": awardRecord.ID}, bson.M{"$set": awardRecord})
	return err
}

func (r *SciResearchRepo) DeleteSciResearch(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}

func (r *AwardRecordRepo) DeleteAwardRecord(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
