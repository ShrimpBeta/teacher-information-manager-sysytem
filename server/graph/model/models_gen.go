// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package graphql_models

import (
	"time"
)

type AcademicTerm struct {
	ID        string    `json:"id"`
	TermName  string    `json:"termName"`
	Courses   []*Course `json:"courses"`
	CreatedAt time.Time `json:"createdAt"`
	UpdateAt  time.Time `json:"updateAt"`
}

type AcademicTermPreview struct {
	Term    *string          `json:"Term,omitempty"`
	Courses []*CoursePreview `json:"courses,omitempty"`
}

type AdminSignInInput struct {
	Account  string `json:"account"`
	Password string `json:"password"`
}

type AuthPayload struct {
	Token string `json:"token"`
}

type AvatarPath struct {
	AvatarURL string `json:"avatarUrl"`
}

type AwardRecord struct {
	ID         string     `json:"id"`
	AwardName  string     `json:"awardName"`
	AwardDate  *time.Time `json:"awardDate,omitempty"`
	Awardlevel *string    `json:"awardlevel,omitempty"`
	AwardRank  *string    `json:"awardRank,omitempty"`
	CreatedAt  time.Time  `json:"createdAt"`
	UpdateAt   time.Time  `json:"updateAt"`
}

type ChangePassword struct {
	OldPassword string `json:"oldPassword"`
	NewPassword string `json:"newPassword"`
}

type ClassTime struct {
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
	UpdateAt         time.Time  `json:"updateAt"`
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

type CoursePreview struct {
	TeacherNames   *string      `json:"teacherNames,omitempty"`
	CourseName     *string      `json:"courseName,omitempty"`
	CourseLocation *string      `json:"courseLocation,omitempty"`
	CourseType     *string      `json:"courseType,omitempty"`
	CourseWeeks    []*string    `json:"courseWeeks,omitempty"`
	ClassTimes     []*ClassTime `json:"classTimes,omitempty"`
	StudentCount   *int         `json:"studentCount,omitempty"`
	Color          *string      `json:"color,omitempty"`
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
	UpdateAt    time.Time     `json:"updateAt"`
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
	Students     []*string  `json:"students"`
	Grade        *string    `json:"grade,omitempty"`
	GuidanceDate *time.Time `json:"guidanceDate,omitempty"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdateAt     time.Time  `json:"updateAt"`
}

type MentorshipPreview struct {
	ProjectName  *string    `json:"projectName,omitempty"`
	Students     []*string  `json:"students,omitempty"`
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
	UpdateAt     time.Time     `json:"updateAt"`
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
	TermName *string      `json:"termName,omitempty"`
	Courses  []*NewCourse `json:"courses"`
}

type NewAwardRecord struct {
	AwardName  string     `json:"awardName"`
	AwardDate  *time.Time `json:"awardDate,omitempty"`
	Awardlevel *string    `json:"awardlevel,omitempty"`
	AwardRank  *string    `json:"awardRank,omitempty"`
}

type NewAwardSciResearch struct {
	TeachersIn  []*string         `json:"teachersIn"`
	TeachersOut []*string         `json:"teachersOut,omitempty"`
	Number      string            `json:"number"`
	Title       string            `json:"title"`
	StartDate   *time.Time        `json:"startDate,omitempty"`
	Duration    *string           `json:"duration,omitempty"`
	Level       *string           `json:"level,omitempty"`
	Rank        *string           `json:"rank,omitempty"`
	Achievement *string           `json:"achievement,omitempty"`
	Fund        *string           `json:"fund,omitempty"`
	IsAward     bool              `json:"isAward"`
	Awards      []*NewAwardRecord `json:"awards"`
}

type NewClassTime struct {
	DayOfWeek int    `json:"dayOfWeek"`
	TimeSlot  string `json:"timeSlot"`
}

type NewCompGuidance struct {
	ProjectName      string     `json:"projectName"`
	StudentNames     []*string  `json:"studentNames"`
	CompetitionScore *string    `json:"competitionScore,omitempty"`
	GuidanceDate     *time.Time `json:"guidanceDate,omitempty"`
	AwardStatus      *string    `json:"awardStatus,omitempty"`
}

type NewCourse struct {
	TeacherNames   *string         `json:"teacherNames,omitempty"`
	CourseName     string          `json:"courseName"`
	CourseLocation *string         `json:"courseLocation,omitempty"`
	CourseType     *string         `json:"courseType,omitempty"`
	CourseWeeks    []*string       `json:"courseWeeks"`
	ClassTimes     []*NewClassTime `json:"classTimes"`
	StudentCount   *int            `json:"studentCount,omitempty"`
	Color          *string         `json:"color,omitempty"`
}

type NewEduReform struct {
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

type NewMentorship struct {
	ProjectName  string     `json:"projectName"`
	Students     []*string  `json:"students"`
	Grade        *string    `json:"grade,omitempty"`
	GuidanceDate *time.Time `json:"guidanceDate,omitempty"`
}

type NewMonograph struct {
	TeachersIn   []*string  `json:"teachersIn"`
	TeachersOut  []*string  `json:"teachersOut,omitempty"`
	Title        string     `json:"title"`
	PublishDate  *time.Time `json:"publishDate,omitempty"`
	PublishLevel *string    `json:"publishLevel,omitempty"`
	Rank         *string    `json:"rank,omitempty"`
}

type NewPaper struct {
	TeachersIn   []*string  `json:"teachersIn"`
	TeachersOut  []*string  `json:"teachersOut,omitempty"`
	Title        string     `json:"title"`
	PublishDate  *time.Time `json:"publishDate,omitempty"`
	Rank         *string    `json:"rank,omitempty"`
	JournalName  *string    `json:"journalName,omitempty"`
	JournalLevel *string    `json:"journalLevel,omitempty"`
}

type NewPassword struct {
	URL         *string `json:"url,omitempty"`
	AppName     *string `json:"appName,omitempty"`
	Account     string  `json:"account"`
	Password    string  `json:"password"`
	Description *string `json:"description,omitempty"`
}

type NewSciResearch struct {
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
	UpdateAt     time.Time     `json:"updateAt"`
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
	Password    string    `json:"password"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdateAt    time.Time `json:"updateAt"`
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
	UpdateAt    time.Time      `json:"updateAt"`
}

type UpdateAcademicTerm struct {
	Name string `json:"name"`
}

type UpdateAwardRecord struct {
	AwardName  *string    `json:"awardName,omitempty"`
	AwardDate  *time.Time `json:"awardDate,omitempty"`
	Awardlevel *string    `json:"awardlevel,omitempty"`
	AwardRank  *string    `json:"awardRank,omitempty"`
}

type UpdateClassTime struct {
	DayOfWeek *int    `json:"dayOfWeek,omitempty"`
	TimeSlot  *string `json:"timeSlot,omitempty"`
}

type UpdateCompGuidance struct {
	ProjectName      *string    `json:"projectName,omitempty"`
	StudentNames     []*string  `json:"studentNames,omitempty"`
	CompetitionScore *string    `json:"competitionScore,omitempty"`
	GuidanceDate     *time.Time `json:"guidanceDate,omitempty"`
	AwardStatus      *string    `json:"awardStatus,omitempty"`
}

type UpdateCourse struct {
	TeacherNames   []*string       `json:"teacherNames,omitempty"`
	CourseName     *string         `json:"courseName,omitempty"`
	CourseLocation *string         `json:"courseLocation,omitempty"`
	CourseType     *string         `json:"courseType,omitempty"`
	CourseWeeks    []*string       `json:"courseWeeks,omitempty"`
	ClassTimes     []*NewClassTime `json:"classTimes,omitempty"`
	StudentCount   *int            `json:"studentCount,omitempty"`
	Color          *string         `json:"color,omitempty"`
}

type UpdateEduReform struct {
	TeachersIn  []*string  `json:"teachersIn,omitempty"`
	TeachersOut []*string  `json:"teachersOut,omitempty"`
	Number      *string    `json:"number,omitempty"`
	Title       *string    `json:"title,omitempty"`
	StartDate   *time.Time `json:"startDate,omitempty"`
	Duration    *string    `json:"duration,omitempty"`
	Level       *string    `json:"level,omitempty"`
	Rank        *string    `json:"rank,omitempty"`
	Achievement *string    `json:"achievement,omitempty"`
	Fund        *string    `json:"fund,omitempty"`
}

type UpdateMentorship struct {
	ProjectName  *string    `json:"projectName,omitempty"`
	Students     []*string  `json:"students,omitempty"`
	Grade        *string    `json:"grade,omitempty"`
	GuidanceDate *time.Time `json:"guidanceDate,omitempty"`
}

type UpdateMonograph struct {
	TeachersIn   []*string  `json:"teachersIn,omitempty"`
	TeachersOut  []*string  `json:"teachersOut,omitempty"`
	Title        *string    `json:"title,omitempty"`
	PublishDate  *time.Time `json:"publishDate,omitempty"`
	PublishLevel *string    `json:"publishLevel,omitempty"`
	Rank         *string    `json:"rank,omitempty"`
}

type UpdatePaper struct {
	TeachersIn   []*string  `json:"teachersIn,omitempty"`
	TeachersOut  []*string  `json:"teachersOut,omitempty"`
	Title        *string    `json:"title,omitempty"`
	PublishDate  *time.Time `json:"publishDate,omitempty"`
	Rank         *string    `json:"rank,omitempty"`
	JournalName  *string    `json:"journalName,omitempty"`
	JournalLevel *string    `json:"journalLevel,omitempty"`
}

type UpdatePassword struct {
	URL         *string `json:"url,omitempty"`
	AppName     *string `json:"appName,omitempty"`
	Account     *string `json:"account,omitempty"`
	Password    *string `json:"password,omitempty"`
	Description *string `json:"description,omitempty"`
}

type UpdateSciResearch struct {
	TeachersIn  []*string  `json:"teachersIn,omitempty"`
	TeachersOut []*string  `json:"teachersOut,omitempty"`
	Number      *string    `json:"number,omitempty"`
	Title       *string    `json:"title,omitempty"`
	StartDate   *time.Time `json:"startDate,omitempty"`
	Duration    *string    `json:"duration,omitempty"`
	Level       *string    `json:"level,omitempty"`
	Rank        *string    `json:"rank,omitempty"`
	Achievement *string    `json:"achievement,omitempty"`
	Fund        *string    `json:"fund,omitempty"`
}

type UpdateUser struct {
	Username    *string `json:"username,omitempty"`
	Avatar      *string `json:"avatar,omitempty"`
	PhoneNumber *string `json:"phoneNumber,omitempty"`
}

type User struct {
	ID          string    `json:"id"`
	Username    string    `json:"username"`
	Email       string    `json:"email"`
	Avatar      string    `json:"avatar"`
	PhoneNumber *string   `json:"phoneNumber,omitempty"`
	WechatToken *string   `json:"wechatToken,omitempty"`
	Activate    bool      `json:"activate"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdateAt    time.Time `json:"updateAt"`
}

type UserCreate struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserExport struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Avatar   string `json:"avatar"`
}
