package services

import "server/persistence/repository"

type UGPGGuidanceService struct {
	Repo *repository.UGPGGuidanceRepo
}

func NewUGPGGuidanceService(r *repository.UGPGGuidanceRepo) *UGPGGuidanceService {
	return &UGPGGuidanceService{Repo: r}
}
