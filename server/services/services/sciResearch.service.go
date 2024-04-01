package services

import "server/persistence/repository"

type SciResearchService struct {
	Repo *repository.SciResearchRepo
}

func NewSciResearchService(r *repository.SciResearchRepo) *SciResearchService {
	return &SciResearchService{Repo: r}
}
