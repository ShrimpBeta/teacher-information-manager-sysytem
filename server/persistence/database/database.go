package database

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// var DB *DataBase

type DataBase struct {
	Client *mongo.Client
}

func Connect(dbUrl string) *DataBase {
	// Use the SetServerAPIOptions() method to set the Stable API version to 1
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(dbUrl).SetServerAPIOptions(serverAPI)

	// Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		log.Fatal(err)
	}

	// Send a ping to confirm a successful connection
	var result bson.M
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{Key: "ping", Value: 1}}).Decode(&result); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")

	return &DataBase{
		Client: client,
	}
}

func (db *DataBase) DisConnect() {
	fmt.Println("Close the connect with MongoDB!")
	if err := db.Client.Disconnect(context.TODO()); err != nil {
		log.Fatal(err)
	}
}
