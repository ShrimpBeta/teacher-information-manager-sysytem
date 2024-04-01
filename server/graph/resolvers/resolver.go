package resolvers

import "server/services/services"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	// AccountService       *services.AccountService
	ClassScheduleService *services.ClassScheduleService
	CompGuidanceService  *services.CompGuidanceService
	EduReformService     *services.EduReformService
	MentorshipService    *services.MentorshipService
	MonographService     *services.MonographService
	PaperService         *services.PaperService
	PasswordService      *services.PasswordService
	SciResearchService   *services.SciResearchService
	UGPGGuidanceService  *services.UGPGGuidanceService
	UserService          *services.UserService
}
