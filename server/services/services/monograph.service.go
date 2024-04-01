package services

import "server/persistence/repository"

type MonographService struct {
	Repo *repository.MonographRepo
}

func NewMonographService(r *repository.MonographRepo) *MonographService {
	return &MonographService{Repo: r}
}
