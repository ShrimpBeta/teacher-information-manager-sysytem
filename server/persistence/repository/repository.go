package repository

import "go.mongodb.org/mongo-driver/mongo"

var Repos *Repositorys

type Repositorys struct {
	ClassScheduleRepo *ClassScheduleRepo
	CompGuidanceRepo  *CompGuidanceRepo
	EduReformRepo     *EduReformRepo
	MentorshipRepo    *MentorshipRepo
	MonographRepo     *MonographRepo
	PaperRepo         *PaperRepo
	PasswordRepo      *PasswordRepo
	SciResearchRepo   *SciResearchRepo
	UGPGGuidanceRepo  *UGPGGuidanceRepo
	UserRepo          *UserRepo
}

func NewRepositorys(db *mongo.Database) *Repositorys {
	return &Repositorys{
		ClassScheduleRepo: NewClassScheduleRepo(db),
		CompGuidanceRepo:  NewCompGuidanceRepo(db),
		EduReformRepo:     NewEduReformRepo(db),
		MentorshipRepo:    NewMentorshipRepo(db),
		MonographRepo:     NewMonographRepo(db),
		PaperRepo:         NewPaperRepo(db),
		PasswordRepo:      NewPasswordRepo(db),
		SciResearchRepo:   NewSciResearchRepo(db),
		UGPGGuidanceRepo:  NewUGPGGuidanceRepo(db),
		UserRepo:          NewUserRepo(db),
	}
}
