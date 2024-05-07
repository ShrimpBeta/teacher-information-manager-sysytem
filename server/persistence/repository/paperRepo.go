package repository

import (
	"context"
	"server/persistence/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type PaperRepo struct {
	collection *mongo.Collection
}

type PaperQueryParams struct {
	TeachersIn       []primitive.ObjectID
	TeachersOut      []*string
	Title            *string
	PublishDateStart *time.Time
	PublishDateEnd   *time.Time
	Rank             *string
	JournalName      *string
	JournalLevel     *string
	CreatedAtStart   *time.Time
	CreatedAtEnd     *time.Time
	UpdatedAtStart   *time.Time
	UpdatedAtEnd     *time.Time
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
	filter := bson.M{"teachersIn": bson.M{"$all": params.TeachersIn}}
	//  filter for teachersOut
	if len(params.TeachersOut) > 0 {
		filter["teachersOut"] = bson.M{"$all": params.TeachersOut}
	}
	// filter for title
	if params.Title != nil {
		filter["title"] = bson.M{"$regex": primitive.Regex{Pattern: *params.Title, Options: "i"}}
	}
	// filter for publishDate
	if params.PublishDateStart != nil || params.PublishDateEnd != nil {
		filter["publishDate"] = bson.M{}
		if params.PublishDateStart != nil {
			publishDateStart := primitive.NewDateTimeFromTime(*params.PublishDateStart)
			filter["publishDate"].(bson.M)["$gte"] = publishDateStart
		}
		if params.PublishDateEnd != nil {
			publishDateEnd := primitive.NewDateTimeFromTime(*params.PublishDateEnd)
			filter["publishDate"].(bson.M)["$lte"] = publishDateEnd
		}
	}
	// filter for rank
	if params.Rank != nil {
		filter["rank"] = bson.M{"$regex": primitive.Regex{Pattern: *params.Rank, Options: "i"}}
	}
	// filter for journalName
	if params.JournalName != nil {
		filter["journalName"] = bson.M{"$regex": primitive.Regex{Pattern: *params.JournalName, Options: "i"}}
	}
	// filter for journalLevel
	if params.JournalLevel != nil {
		filter["journalLevel"] = bson.M{"$regex": primitive.Regex{Pattern: *params.JournalLevel, Options: "i"}}
	}
	// filter for createdAt
	if params.CreatedAtStart != nil || params.CreatedAtEnd != nil {
		filter["createdAt"] = bson.M{}
		if params.CreatedAtStart != nil {
			createdStart := primitive.NewDateTimeFromTime(*params.CreatedAtStart)
			filter["createdAt"].(bson.M)["$gte"] = createdStart
		}
		if params.CreatedAtEnd != nil {
			createdEnd := primitive.NewDateTimeFromTime(*params.CreatedAtEnd)
			filter["createdAt"].(bson.M)["$lte"] = createdEnd
		}
	}
	// filter for updatedAt
	if params.UpdatedAtStart != nil || params.UpdatedAtEnd != nil {
		filter["updatedAt"] = bson.M{}
		if params.UpdatedAtStart != nil {
			updatedStart := primitive.NewDateTimeFromTime(*params.UpdatedAtStart)
			filter["updatedAt"].(bson.M)["$gte"] = updatedStart
		}
		if params.UpdatedAtEnd != nil {
			updatedEnd := primitive.NewDateTimeFromTime(*params.UpdatedAtEnd)
			filter["updatedAt"].(bson.M)["$lte"] = updatedEnd
		}
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
	paper.ID = primitive.NewObjectID()
	createdTime := primitive.NewDateTimeFromTime(time.Now())
	paper.CreatedAt = createdTime
	paper.UpdatedAt = createdTime
	result, err := r.collection.InsertOne(context.Background(), paper)
	if err != nil {
		return nil, err
	}
	newPaperId := result.InsertedID.(primitive.ObjectID)
	return &newPaperId, nil
}

func (r *PaperRepo) UpdatePaper(paper *models.Paper) error {
	paper.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	_, err := r.collection.ReplaceOne(
		context.Background(),
		bson.M{"_id": paper.ID},
		paper,
	)
	return err
}

func (r *PaperRepo) DeletePaper(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}

func (r *PaperRepo) GetPaperReports(ids []primitive.ObjectID, startDate, ednDate time.Time) ([]models.PaperReport, error) {
	paperReports := []models.PaperReport{}

	filter := bson.M{
		"teachersIn": bson.M{"$in": ids},
		"publishDate": bson.M{
			"$gte": primitive.NewDateTimeFromTime(startDate),
			"$lte": primitive.NewDateTimeFromTime(ednDate),
		},
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
		paperReports = append(paperReports, models.PaperReport{
			TeachersIn:  paper.TeachersIn,
			Title:       paper.Title,
			PublishDate: paper.PublishDate,
		})
	}
	return paperReports, nil
}
