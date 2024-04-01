package services

import "server/persistence/repository"

type EduReformService struct {
	Repo *repository.EduReformRepo
}

func NewEduReformService(r *repository.EduReformRepo) *EduReformService {
	return &EduReformService{Repo: r}
}
