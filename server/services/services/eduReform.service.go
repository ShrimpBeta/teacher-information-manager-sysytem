package services

import "server/persistence/repository"

type EduReformService struct {
	Repo *repository.EduReformRepo
}

func NewEduReformService(edureformRepo *repository.EduReformRepo) *EduReformService {
	return &EduReformService{Repo: edureformRepo}
}
