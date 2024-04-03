package services

import "server/persistence/repository"

type MonographService struct {
	Repo *repository.MonographRepo
}

func NewMonographService(monographRepo *repository.MonographRepo) *MonographService {
	return &MonographService{Repo: monographRepo}
}
