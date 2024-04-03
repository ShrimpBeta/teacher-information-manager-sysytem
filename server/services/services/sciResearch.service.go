package services

import "server/persistence/repository"

type SciResearchService struct {
	Repo *repository.SciResearchRepo
}

func NewSciResearchService(sciResearchRepo *repository.SciResearchRepo) *SciResearchService {
	return &SciResearchService{Repo: sciResearchRepo}
}
