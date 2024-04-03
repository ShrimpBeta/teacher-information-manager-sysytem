package services

import "server/persistence/repository"

type ClassScheduleService struct {
	Repo *repository.ClassScheduleRepo
}

func NewClassScheduleService(classScheduleRepo *repository.ClassScheduleRepo) *ClassScheduleService {
	return &ClassScheduleService{Repo: classScheduleRepo}
}
