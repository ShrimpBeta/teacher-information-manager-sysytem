package repository

import (
	"context"
	"server/persistence/models"
	"time"

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
	TeachersIn        []primitive.ObjectID
	TeachersOut       []*string
	Number            *string
	Title             *string
	StartDateStart    *time.Time
	StartDateEnd      *time.Time
	Level             *string
	Rank              *string
	Achievement       *string
	Fund              *string
	CreatedStart      *time.Time
	CreatedEnd        *time.Time
	UpdatedStart      *time.Time
	UpdatedEnd        *time.Time
	IsAward           bool
	AwardName         *string
	AwardDateStart    *time.Time
	AwardDateEnd      *time.Time
	AwardLevel        *string
	AwardRank         *string
	AwardCreatedStart *time.Time
	AwardCreatedEnd   *time.Time
	AwardUpdatedStart *time.Time
	AwardUpdatedEnd   *time.Time
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
	if params.TeachersOut != nil {
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
	// filter for created
	if params.CreatedStart != nil || params.CreatedEnd != nil {
		filter["createdAt"] = bson.M{}
		if params.CreatedStart != nil {
			createdStart := primitive.NewDateTimeFromTime(*params.CreatedStart)
			filter["createdAt"].(bson.M)["$gte"] = createdStart
		}
		if params.CreatedEnd != nil {
			createdEnd := primitive.NewDateTimeFromTime(*params.CreatedEnd)
			filter["createdAt"].(bson.M)["$lte"] = createdEnd
		}
	}
	// filter for updated
	if params.UpdatedStart != nil || params.UpdatedEnd != nil {
		filter["updatedAt"] = bson.M{}
		if params.UpdatedStart != nil {
			updatedStart := primitive.NewDateTimeFromTime(*params.UpdatedStart)
			filter["updatedAt"].(bson.M)["$gte"] = updatedStart
		}
		if params.UpdatedEnd != nil {
			updatedEnd := primitive.NewDateTimeFromTime(*params.UpdatedEnd)
			filter["updatedAt"].(bson.M)["$lte"] = updatedEnd
		}
	}
	// filter for Award
	if params.IsAward {
		filter["isAward"] = true
		// filter for awardName
		if params.AwardName != nil {
			filter["awarddRecords.awardName"] = bson.M{"$regex": primitive.Regex{Pattern: *params.AwardName, Options: "i"}}
		}
		// filter for awardDate
		if params.AwardDateStart != nil || params.AwardDateEnd != nil {
			filter["awarddRecords.awardDate"] = bson.M{}
			if params.AwardDateStart != nil {
				awardDateStart := primitive.NewDateTimeFromTime(*params.AwardDateStart)
				filter["awarddRecords.awardDate"].(bson.M)["$gte"] = awardDateStart
			}
			if params.AwardDateEnd != nil {
				awardDateEnd := primitive.NewDateTimeFromTime(*params.AwardDateEnd)
				filter["awarddRecords.awardDate"].(bson.M)["$lte"] = awardDateEnd
			}
		}
		// filter for awardLevel
		if params.AwardLevel != nil {
			filter["awarddRecords.awardLevel"] = bson.M{"$regex": primitive.Regex{Pattern: *params.AwardLevel, Options: "i"}}
		}
		// filter for awardRank
		if params.AwardRank != nil {
			filter["awarddRecords.awardRank"] = bson.M{"$regex": primitive.Regex{Pattern: *params.AwardRank, Options: "i"}}
		}
		// filter for awardCreated
		if params.AwardCreatedStart != nil || params.AwardCreatedEnd != nil {
			filter["awarddRecords.createdAt"] = bson.M{}
			if params.AwardCreatedStart != nil {
				awardCreatedStart := primitive.NewDateTimeFromTime(*params.AwardCreatedStart)
				filter["awarddRecords.createdAt"].(bson.M)["$gte"] = awardCreatedStart
			}
			if params.AwardCreatedEnd != nil {
				awardCreatedEnd := primitive.NewDateTimeFromTime(*params.AwardCreatedEnd)
				filter["awarddRecords.createdAt"].(bson.M)["$lte"] = awardCreatedEnd
			}
		}
		// filter for awardUpdated
		if params.AwardUpdatedStart != nil || params.AwardUpdatedEnd != nil {
			filter["awarddRecords.updatedAt"] = bson.M{}
			if params.AwardUpdatedStart != nil {
				awardUpdatedStart := primitive.NewDateTimeFromTime(*params.AwardUpdatedStart)
				filter["awarddRecords.updatedAt"].(bson.M)["$gte"] = awardUpdatedStart
			}
			if params.AwardUpdatedEnd != nil {
				awardUpdatedEnd := primitive.NewDateTimeFromTime(*params.AwardUpdatedEnd)
				filter["awarddRecords.updatedAt"].(bson.M)["$lte"] = awardUpdatedEnd
			}
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
	objectId := primitive.NewObjectID()
	createdTime := primitive.NewDateTimeFromTime(time.Now())
	sciResearch.ID = objectId
	sciResearch.CreatedAt = createdTime
	sciResearch.UpdatedAt = createdTime

	if sciResearch.AwarddRecords != nil {
		for _, awardRecord := range sciResearch.AwarddRecords {
			awardRecord.ID = primitive.NewObjectID()
			awardRecord.CreatedAt = createdTime
			awardRecord.UpdatedAt = createdTime
		}
	}

	result, err := r.collection.InsertOne(context.Background(), sciResearch)
	if err != nil {
		return nil, err
	}
	newSciResearchId := result.InsertedID.(primitive.ObjectID)
	return &newSciResearchId, nil
}

func (r *SciResearchRepo) AddAwardRecord(sciResearchId primitive.ObjectID, awardRecord *models.AwardRecord) error {
	awardRecord.ID = primitive.NewObjectID()
	createdTime := primitive.NewDateTimeFromTime(time.Now())
	awardRecord.CreatedAt = createdTime
	awardRecord.UpdatedAt = createdTime
	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": sciResearchId},
		bson.M{
			"$push": bson.M{"awarddRecords": awardRecord},
			"$set":  bson.M{"updatedAt": createdTime},
		},
	)
	return err
}

func (r *SciResearchRepo) UpdateSciResearch(sciResearch *models.SciResearch) error {
	sciResearch.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	_, err := r.collection.UpdateOne(context.Background(), bson.M{"_id": sciResearch.ID}, bson.M{"$set": sciResearch})
	return err
}

func (r *AwardRecordRepo) UpdateAwardRecord(sciResearchId primitive.ObjectID, awardRecord *models.AwardRecord) error {
	updatedTime := primitive.NewDateTimeFromTime(time.Now())
	awardRecord.UpdatedAt = updatedTime
	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": sciResearchId, "awarddRecords._id": awardRecord.ID},
		bson.M{
			"$set": bson.M{"awarddRecords.$": awardRecord, "updatedAt": updatedTime},
		},
	)
	return err
}

func (r *SciResearchRepo) DeleteSciResearch(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}

func (r *AwardRecordRepo) DeleteAwardRecord(id primitive.ObjectID) error {
	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": id},
		bson.M{
			"$pull": bson.M{"awarddRecords": bson.M{"_id": id}},
			"$set":  bson.M{"updatedAt": primitive.NewDateTimeFromTime(time.Now())},
		},
	)
	return err
}
