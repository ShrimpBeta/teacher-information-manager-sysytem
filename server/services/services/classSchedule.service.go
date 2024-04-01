package services

import "server/persistence/repository"

type ClassScheduleService struct {
	Repo *repository.ClassScheduleRepo
}

func NewClassScheduleService(r *repository.ClassScheduleRepo) *ClassScheduleService {
	return &ClassScheduleService{Repo: r}
}
