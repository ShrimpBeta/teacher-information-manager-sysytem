package services

import "server/persistence/repository"

type UGPGGuidanceService struct {
	Repo *repository.UGPGGuidanceRepo
}

func NewUGPGGuidanceService(uGPGGuidanceRepo *repository.UGPGGuidanceRepo) *UGPGGuidanceService {
	return &UGPGGuidanceService{Repo: uGPGGuidanceRepo}
}
