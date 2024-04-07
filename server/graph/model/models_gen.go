// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package graphql_models

import (
	"time"

	"github.com/99designs/gqlgen/graphql"
)

type AcademicTerm struct {
	ID        string    `json:"id"`
	TermName  string    `json:"termName"`
	Courses   []*Course `json:"courses"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type AcademicTermPreview struct {
	TermName *string          `json:"termName,omitempty"`
	Courses  []*CoursePreview `json:"courses,omitempty"`
}

type AcademicTermShort struct {
	ID        string    `json:"id"`
	TermName  string    `json:"termName"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type ActivateUser struct {
	Username    string          `json:"username"`
	Password    string          `json:"password"`
	Avatar      *graphql.Upload `json:"avatar,omitempty"`
	PhoneNumber *string         `json:"phoneNumber,omitempty"`
}

type AdminSignInInput struct {
	Account  string `json:"account"`
	Password string `json:"password"`
}

type AuthPayload struct {
	Token string `json:"token"`
}

type AwardRecord struct {
	ID         string     `json:"id"`
	AwardName  string     `json:"awardName"`
	AwardDate  *time.Time `json:"awardDate,omitempty"`
	Awardlevel *string    `json:"awardlevel,omitempty"`
	AwardRank  *string    `json:"awardRank,omitempty"`
	CreatedAt  time.Time  `json:"createdAt"`
	UpdatedAt  time.Time  `json:"updatedAt"`
}

type AwardRecordData struct {
	AwardName  string     `json:"awardName"`
	AwardDate  *time.Time `json:"awardDate,omitempty"`
	Awardlevel *string    `json:"awardlevel,omitempty"`
	AwardRank  *string    `json:"awardRank,omitempty"`
}

type AwardRecordPreview struct {
	AwardName  *string    `json:"awardName,omitempty"`
	AwardDate  *time.Time `json:"awardDate,omitempty"`
	Awardlevel *string    `json:"awardlevel,omitempty"`
	AwardRank  *string    `json:"awardRank,omitempty"`
}

type ClassTime struct {
	DayOfWeek int    `json:"dayOfWeek"`
	TimeSlot  string `json:"timeSlot"`
}

type ClassTimeData struct {
	DayOfWeek int    `json:"dayOfWeek"`
	TimeSlot  string `json:"timeSlot"`
}

type ClassTimePreview struct {
	DayOfWeek *int    `json:"dayOfWeek,omitempty"`
	TimeSlot  *string `json:"timeSlot,omitempty"`
}

type CompGuidance struct {
	ID               string     `json:"id"`
	ProjectName      string     `json:"projectName"`
	StudentNames     []*string  `json:"studentNames"`
	CompetitionScore *string    `json:"competitionScore,omitempty"`
	GuidanceDate     *time.Time `json:"guidanceDate,omitempty"`
	AwardStatus      *string    `json:"awardStatus,omitempty"`
	CreatedAt        time.Time  `json:"createdAt"`
	UpdatedAt        time.Time  `json:"updatedAt"`
}

type CompGuidanceData struct {
	ProjectName      string     `json:"projectName"`
	StudentNames     []*string  `json:"studentNames"`
	CompetitionScore *string    `json:"competitionScore,omitempty"`
	GuidanceDate     *time.Time `json:"guidanceDate,omitempty"`
	AwardStatus      *string    `json:"awardStatus,omitempty"`
}

type CompGuidanceFilter struct {
	ProjectName       *string    `json:"projectName,omitempty"`
	StudentNames      []*string  `json:"studentNames,omitempty"`
	GuidanceDateStart *time.Time `json:"guidanceDateStart,omitempty"`
	GuidanceDateEnd   *time.Time `json:"guidanceDateEnd,omitempty"`
	AwardStatus       *string    `json:"awardStatus,omitempty"`
	CreatedStart      *time.Time `json:"createdStart,omitempty"`
	CreatedEnd        *time.Time `json:"createdEnd,omitempty"`
	UpdatedStart      *time.Time `json:"updatedStart,omitempty"`
	UpdatedEnd        *time.Time `json:"updatedEnd,omitempty"`
}

type CompGuidancePreview struct {
	ProjectName      *string    `json:"projectName,omitempty"`
	StudentNames     []*string  `json:"studentNames,omitempty"`
	CompetitionScore *string    `json:"competitionScore,omitempty"`
	GuidanceDate     *time.Time `json:"guidanceDate,omitempty"`
	AwardStatus      *string    `json:"awardStatus,omitempty"`
}

type Course struct {
	ID             string       `json:"id"`
	TeacherNames   string       `json:"teacherNames"`
	CourseName     string       `json:"courseName"`
	CourseLocation *string      `json:"courseLocation,omitempty"`
	CourseType     *string      `json:"courseType,omitempty"`
	CourseWeeks    []*string    `json:"courseWeeks"`
	ClassTimes     []*ClassTime `json:"classTimes"`
	StudentCount   *int         `json:"studentCount,omitempty"`
	Color          *string      `json:"color,omitempty"`
}

type CourseData struct {
	TeacherNames   *string          `json:"teacherNames,omitempty"`
	CourseName     string           `json:"courseName"`
	CourseLocation *string          `json:"courseLocation,omitempty"`
	CourseType     *string          `json:"courseType,omitempty"`
	CourseWeeks    []*string        `json:"courseWeeks"`
	ClassTimes     []*ClassTimeData `json:"classTimes"`
	StudentCount   *int             `json:"studentCount,omitempty"`
	Color          *string          `json:"color,omitempty"`
}

type CoursePreview struct {
	TeacherNames   *string             `json:"teacherNames,omitempty"`
	CourseName     *string             `json:"courseName,omitempty"`
	CourseLocation *string             `json:"courseLocation,omitempty"`
	CourseType     *string             `json:"courseType,omitempty"`
	CourseWeeks    []*string           `json:"courseWeeks,omitempty"`
	ClassTimes     []*ClassTimePreview `json:"classTimes,omitempty"`
	StudentCount   *int                `json:"studentCount,omitempty"`
	Color          *string             `json:"color,omitempty"`
}

type EduReform struct {
	ID          string        `json:"id"`
	TeachersIn  []*UserExport `json:"teachersIn"`
	TeachersOut []*string     `json:"teachersOut,omitempty"`
	Number      string        `json:"number"`
	Title       string        `json:"title"`
	StartDate   *time.Time    `json:"startDate,omitempty"`
	Duration    *string       `json:"duration,omitempty"`
	Level       *string       `json:"level,omitempty"`
	Rank        *string       `json:"rank,omitempty"`
	Achievement *string       `json:"achievement,omitempty"`
	Fund        *string       `json:"fund,omitempty"`
	CreatedAt   time.Time     `json:"createdAt"`
	UpdatedAt   time.Time     `json:"updatedAt"`
}

type EduReformData struct {
	TeachersIn  []*string  `json:"teachersIn"`
	TeachersOut []*string  `json:"teachersOut,omitempty"`
	Number      string     `json:"number"`
	Title       string     `json:"title"`
	StartDate   *time.Time `json:"startDate,omitempty"`
	Duration    *string    `json:"duration,omitempty"`
	Level       *string    `json:"level,omitempty"`
	Rank        *string    `json:"rank,omitempty"`
	Achievement *string    `json:"achievement,omitempty"`
	Fund        *string    `json:"fund,omitempty"`
}

type EduReformFilter struct {
	TeachersIn     []*string  `json:"teachersIn"`
	TeachersOut    []*string  `json:"teachersOut,omitempty"`
	Number         *string    `json:"number,omitempty"`
	Title          *string    `json:"title,omitempty"`
	StartDateStart *time.Time `json:"startDateStart,omitempty"`
	StartDateEnd   *time.Time `json:"startDateEnd,omitempty"`
	Level          *string    `json:"level,omitempty"`
	Rank           *string    `json:"rank,omitempty"`
	Achievement    *string    `json:"achievement,omitempty"`
	Fund           *string    `json:"fund,omitempty"`
	CreatedStart   *time.Time `json:"createdStart,omitempty"`
	CreatedEnd     *time.Time `json:"createdEnd,omitempty"`
	UpdatedStart   *time.Time `json:"updatedStart,omitempty"`
	UpdatedEnd     *time.Time `json:"updatedEnd,omitempty"`
}

type EduReformPreview struct {
	TeachersIn  []*UserExport `json:"teachersIn,omitempty"`
	TeachersOut []*string     `json:"teachersOut,omitempty"`
	Number      *string       `json:"number,omitempty"`
	Title       *string       `json:"title,omitempty"`
	StartDate   *time.Time    `json:"startDate,omitempty"`
	Duration    *string       `json:"duration,omitempty"`
	Level       *string       `json:"level,omitempty"`
	Rank        *string       `json:"rank,omitempty"`
	Achievement *string       `json:"achievement,omitempty"`
	Fund        *string       `json:"fund,omitempty"`
}

type Mentorship struct {
	ID           string     `json:"id"`
	ProjectName  string     `json:"projectName"`
	StudentNames []*string  `json:"studentNames"`
	Grade        *string    `json:"grade,omitempty"`
	GuidanceDate *time.Time `json:"guidanceDate,omitempty"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
}

type MentorshipData struct {
	ProjectName  string     `json:"projectName"`
	StudentNames []*string  `json:"studentNames"`
	Grade        *string    `json:"grade,omitempty"`
	GuidanceDate *time.Time `json:"guidanceDate,omitempty"`
}

type MentorshipFilter struct {
	ProjectName       *string    `json:"projectName,omitempty"`
	StudentNames      []*string  `json:"studentNames,omitempty"`
	Grade             *string    `json:"grade,omitempty"`
	GuidanceDateStart *time.Time `json:"guidanceDateStart,omitempty"`
	GuidanceDateEnd   *time.Time `json:"guidanceDateEnd,omitempty"`
	CreatedStart      *time.Time `json:"createdStart,omitempty"`
	CreatedEnd        *time.Time `json:"createdEnd,omitempty"`
	UpdatedStart      *time.Time `json:"updatedStart,omitempty"`
	UpdatedEnd        *time.Time `json:"updatedEnd,omitempty"`
}

type MentorshipPreview struct {
	ProjectName  *string    `json:"projectName,omitempty"`
	StudentNames []*string  `json:"studentNames,omitempty"`
	Grade        *string    `json:"grade,omitempty"`
	GuidanceDate *time.Time `json:"guidanceDate,omitempty"`
}

type Monograph struct {
	ID           string        `json:"id"`
	TeachersIn   []*UserExport `json:"teachersIn"`
	TeachersOut  []*string     `json:"teachersOut,omitempty"`
	Title        string        `json:"title"`
	PublishDate  *time.Time    `json:"publishDate,omitempty"`
	PublishLevel *string       `json:"publishLevel,omitempty"`
	Rank         *string       `json:"rank,omitempty"`
	CreatedAt    time.Time     `json:"createdAt"`
	UpdatedAt    time.Time     `json:"updatedAt"`
}

type MonographData struct {
	TeachersIn   []*string  `json:"teachersIn"`
	TeachersOut  []*string  `json:"teachersOut,omitempty"`
	Title        string     `json:"title"`
	PublishDate  *time.Time `json:"publishDate,omitempty"`
	PublishLevel *string    `json:"publishLevel,omitempty"`
	Rank         *string    `json:"rank,omitempty"`
}

type MonographFilter struct {
	TeachersIn       []*string  `json:"teachersIn"`
	TeachersOut      []*string  `json:"teachersOut,omitempty"`
	Title            *string    `json:"title,omitempty"`
	PublishDateStart *time.Time `json:"publishDateStart,omitempty"`
	PublishDateEnd   *time.Time `json:"publishDateEnd,omitempty"`
	PublishLevel     *string    `json:"publishLevel,omitempty"`
	Rank             *string    `json:"rank,omitempty"`
	CreatedStart     *time.Time `json:"createdStart,omitempty"`
	CreatedEnd       *time.Time `json:"createdEnd,omitempty"`
	UpdatedStart     *time.Time `json:"updatedStart,omitempty"`
	UpdatedEnd       *time.Time `json:"updatedEnd,omitempty"`
}

type MonographPreview struct {
	TeachersIn   []*UserExport `json:"teachersIn,omitempty"`
	TeachersOut  []*string     `json:"teachersOut,omitempty"`
	Title        *string       `json:"title,omitempty"`
	PublishDate  *time.Time    `json:"publishDate,omitempty"`
	PublishLevel *string       `json:"publishLevel,omitempty"`
	Rank         *string       `json:"rank,omitempty"`
}

type Mutation struct {
}

type NewAcademicTerm struct {
	TermName string        `json:"termName"`
	Courses  []*CourseData `json:"courses"`
}

type NewUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Paper struct {
	ID           string        `json:"id"`
	TeachersIn   []*UserExport `json:"teachersIn"`
	TeachersOut  []*string     `json:"teachersOut,omitempty"`
	Title        string        `json:"title"`
	PublishDate  *time.Time    `json:"publishDate,omitempty"`
	Rank         *string       `json:"rank,omitempty"`
	JournalName  *string       `json:"journalName,omitempty"`
	JournalLevel *string       `json:"journalLevel,omitempty"`
	CreatedAt    time.Time     `json:"createdAt"`
	UpdatedAt    time.Time     `json:"updatedAt"`
}

type PaperData struct {
	TeachersIn   []*string  `json:"teachersIn"`
	TeachersOut  []*string  `json:"teachersOut,omitempty"`
	Title        string     `json:"title"`
	PublishDate  *time.Time `json:"publishDate,omitempty"`
	Rank         *string    `json:"rank,omitempty"`
	JournalName  *string    `json:"journalName,omitempty"`
	JournalLevel *string    `json:"journalLevel,omitempty"`
}

type PaperFilter struct {
	TeachersIn       []*string  `json:"teachersIn"`
	TeachersOut      []*string  `json:"teachersOut,omitempty"`
	Title            *string    `json:"title,omitempty"`
	PublishDateStart *time.Time `json:"publishDateStart,omitempty"`
	PublishDateEnd   *time.Time `json:"publishDateEnd,omitempty"`
	Rank             *string    `json:"rank,omitempty"`
	JournalName      *string    `json:"journalName,omitempty"`
	JournalLevel     *string    `json:"journalLevel,omitempty"`
	CreatedStart     *time.Time `json:"createdStart,omitempty"`
	CreatedEnd       *time.Time `json:"createdEnd,omitempty"`
	UpdatedStart     *time.Time `json:"updatedStart,omitempty"`
	UpdatedEnd       *time.Time `json:"updatedEnd,omitempty"`
}

type PaperPreview struct {
	TeachersIn   []*UserExport `json:"teachersIn,omitempty"`
	TeachersOut  []*string     `json:"teachersOut,omitempty"`
	Title        *string       `json:"title,omitempty"`
	PublishDate  *time.Time    `json:"publishDate,omitempty"`
	Rank         *string       `json:"rank,omitempty"`
	JournalName  *string       `json:"journalName,omitempty"`
	JournalLevel *string       `json:"journalLevel,omitempty"`
}

type Password struct {
	ID          string    `json:"id"`
	URL         *string   `json:"url,omitempty"`
	AppName     *string   `json:"appName,omitempty"`
	Account     string    `json:"account"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type PasswordData struct {
	URL         *string `json:"url,omitempty"`
	AppName     *string `json:"appName,omitempty"`
	Account     string  `json:"account"`
	Password    string  `json:"password"`
	Description *string `json:"description,omitempty"`
}

type PasswordFilter struct {
	URL     *string `json:"url,omitempty"`
	AppName *string `json:"appName,omitempty"`
	Account *string `json:"account,omitempty"`
}

type PasswordPreview struct {
	URL         *string `json:"url,omitempty"`
	AppName     *string `json:"appName,omitempty"`
	Account     string  `json:"account"`
	Password    string  `json:"password"`
	Description *string `json:"description,omitempty"`
}

type PasswordTrue struct {
	ID          string    `json:"id"`
	URL         *string   `json:"url,omitempty"`
	AppName     *string   `json:"appName,omitempty"`
	Account     string    `json:"account"`
	Password    string    `json:"password"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type Query struct {
}

type ResetPassword struct {
	Email       string `json:"email"`
	Code        string `json:"code"`
	NewPassword string `json:"newPassword"`
}

type SciResearch struct {
	ID          string         `json:"id"`
	TeachersIn  []*UserExport  `json:"teachersIn"`
	TeachersOut []*string      `json:"teachersOut,omitempty"`
	Number      string         `json:"number"`
	Title       string         `json:"title"`
	StartDate   *time.Time     `json:"startDate,omitempty"`
	Duration    *string        `json:"duration,omitempty"`
	Level       *string        `json:"level,omitempty"`
	Rank        *string        `json:"rank,omitempty"`
	Achievement *string        `json:"achievement,omitempty"`
	Fund        *string        `json:"fund,omitempty"`
	IsAward     bool           `json:"isAward"`
	Awards      []*AwardRecord `json:"awards,omitempty"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
}

type SciResearchData struct {
	TeachersIn  []*string          `json:"teachersIn"`
	TeachersOut []*string          `json:"teachersOut,omitempty"`
	Number      string             `json:"number"`
	Title       string             `json:"title"`
	StartDate   *time.Time         `json:"startDate,omitempty"`
	Duration    *string            `json:"duration,omitempty"`
	Level       *string            `json:"level,omitempty"`
	Rank        *string            `json:"rank,omitempty"`
	Achievement *string            `json:"achievement,omitempty"`
	Fund        *string            `json:"fund,omitempty"`
	IsAward     bool               `json:"isAward"`
	Awards      []*AwardRecordData `json:"awards,omitempty"`
}

type SciResearchFilter struct {
	TeachersIn        []*string  `json:"teachersIn"`
	TeachersOut       []*string  `json:"teachersOut,omitempty"`
	Number            *string    `json:"number,omitempty"`
	Title             *string    `json:"title,omitempty"`
	StartDateStart    *time.Time `json:"startDateStart,omitempty"`
	StartDateEnd      *time.Time `json:"startDateEnd,omitempty"`
	Level             *string    `json:"level,omitempty"`
	Rank              *string    `json:"rank,omitempty"`
	Achievement       *string    `json:"achievement,omitempty"`
	Fund              *string    `json:"fund,omitempty"`
	CreatedStart      *time.Time `json:"createdStart,omitempty"`
	CreatedEnd        *time.Time `json:"createdEnd,omitempty"`
	UpdatedStart      *time.Time `json:"updatedStart,omitempty"`
	UpdatedEnd        *time.Time `json:"updatedEnd,omitempty"`
	IsAward           bool       `json:"isAward"`
	AwardName         *string    `json:"awardName,omitempty"`
	AwardDateStart    *time.Time `json:"awardDateStart,omitempty"`
	AwardDateEnd      *time.Time `json:"awardDateEnd,omitempty"`
	Awardlevel        *string    `json:"awardlevel,omitempty"`
	AwardRank         *string    `json:"awardRank,omitempty"`
	AwardCreatedStart *time.Time `json:"awardCreatedStart,omitempty"`
	AwardCreatedEnd   *time.Time `json:"awardCreatedEnd,omitempty"`
	AwardUpdatedStart *time.Time `json:"awardUpdatedStart,omitempty"`
	AwardUpdatedEnd   *time.Time `json:"awardUpdatedEnd,omitempty"`
}

type SciResearchPreview struct {
	TeachersIn  []*UserExport         `json:"teachersIn,omitempty"`
	TeachersOut []*string             `json:"teachersOut,omitempty"`
	Number      *string               `json:"number,omitempty"`
	Title       *string               `json:"title,omitempty"`
	StartDate   *time.Time            `json:"startDate,omitempty"`
	Duration    *string               `json:"duration,omitempty"`
	Level       *string               `json:"level,omitempty"`
	Rank        *string               `json:"rank,omitempty"`
	Achievement *string               `json:"achievement,omitempty"`
	Fund        *string               `json:"fund,omitempty"`
	IsAward     *bool                 `json:"isAward,omitempty"`
	Awards      []*AwardRecordPreview `json:"awards,omitempty"`
}

type SigIn struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SignInResponse struct {
	Token string `json:"token"`
	User  *User  `json:"user"`
}

type UGPGGuidance struct {
	ID                 string     `json:"id"`
	StudentName        string     `json:"studentName"`
	ThesisTopic        string     `json:"thesisTopic"`
	OpeningCheckDate   *time.Time `json:"openingCheckDate,omitempty"`
	OpeningCheckResult *string    `json:"openingCheckResult,omitempty"`
	MidtermCheckDate   *time.Time `json:"midtermCheckDate,omitempty"`
	MidtermCheckResult *string    `json:"midtermCheckResult,omitempty"`
	DefenseDate        *time.Time `json:"defenseDate,omitempty"`
	DefenseResult      *string    `json:"defenseResult,omitempty"`
	CreatedAt          time.Time  `json:"createdAt"`
	UpdatedAt          time.Time  `json:"updatedAt"`
}

type UGPGGuidanceData struct {
	StudentName        string     `json:"studentName"`
	ThesisTopic        string     `json:"thesisTopic"`
	OpeningCheckDate   *time.Time `json:"openingCheckDate,omitempty"`
	OpeningCheckResult *string    `json:"openingCheckResult,omitempty"`
	MidtermCheckDate   *time.Time `json:"midtermCheckDate,omitempty"`
	MidtermCheckResult *string    `json:"midtermCheckResult,omitempty"`
	DefenseDate        *time.Time `json:"defenseDate,omitempty"`
	DefenseResult      *string    `json:"defenseResult,omitempty"`
}

type UGPGGuidanceFilter struct {
	StudentName      *string    `json:"studentName,omitempty"`
	ThesisTopic      *string    `json:"thesisTopic,omitempty"`
	DefenseDateStart *time.Time `json:"defenseDateStart,omitempty"`
	DefenseDateEnd   *time.Time `json:"defenseDateEnd,omitempty"`
	CreatedStart     *time.Time `json:"createdStart,omitempty"`
	CreatedEnd       *time.Time `json:"createdEnd,omitempty"`
	UpdatedStart     *time.Time `json:"updatedStart,omitempty"`
	UpdatedEnd       *time.Time `json:"updatedEnd,omitempty"`
}

type UGPGGuidancePreview struct {
	StudentName        *string    `json:"studentName,omitempty"`
	ThesisTopic        *string    `json:"thesisTopic,omitempty"`
	OpeningCheckDate   *time.Time `json:"openingCheckDate,omitempty"`
	OpeningCheckResult *string    `json:"openingCheckResult,omitempty"`
	MidtermCheckDate   *time.Time `json:"midtermCheckDate,omitempty"`
	MidtermCheckResult *string    `json:"midtermCheckResult,omitempty"`
	DefenseDate        *time.Time `json:"defenseDate,omitempty"`
	DefenseResult      *string    `json:"defenseResult,omitempty"`
}

type UpdateAcademicTerm struct {
	TermName string `json:"termName"`
}

type UpdatePassword struct {
	OldPassword string `json:"oldPassword"`
	NewPassword string `json:"newPassword"`
}

type UpdateUser struct {
	Username    string          `json:"username"`
	Avatar      *graphql.Upload `json:"avatar,omitempty"`
	PhoneNumber *string         `json:"phoneNumber,omitempty"`
}

type User struct {
	ID          string    `json:"id"`
	Username    string    `json:"username"`
	Email       string    `json:"email"`
	Avatar      string    `json:"avatar"`
	PhoneNumber *string   `json:"phoneNumber,omitempty"`
	WechatAuth  bool      `json:"wechatAuth"`
	Activate    bool      `json:"activate"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type UserCreate struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserExport struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Avatar    string    `json:"avatar"`
	CreatedAt time.Time `json:"createdAt"`
}

type WechatAuth struct {
	OpenID     string `json:"openId"`
	SessionKey string `json:"sessionKey"`
}
