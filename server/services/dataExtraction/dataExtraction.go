package dataextraction

import (
	"regexp"
	graphql_models "server/graph/model"
	"strings"
	"time"
)

func parseDate(dateStr string) *time.Time {
	// 定义可能的日期格式
	dateFormats := []string{
		"2006/1/2",
		"2006/01/02",
		"2006-1-2",
		"2006-01-02",
		"2006年1月2日",
	}

	var parsedDate time.Time
	var err error
	for _, format := range dateFormats {
		parsedDate, err = time.Parse(format, dateStr)
		if err == nil {
			// 如果解析成功，返回解析到的日期
			return &parsedDate
		}
	}
	return nil
}

// from string to compguidance
func StringToCompGuidance(data string) (graphql_models.CompGuidancePreview, error) {
	regexPatterns := map[string]string{
		"项目名称": `项目名称\s*[:：]\s*([^\r\n]+)`,
		"学生姓名": `学生姓名\s*[:：]\s*([^\r\n]+)`,
		"竞赛成绩": `竞赛成绩\s*[:：]\s*([^\r\n]+)`,
		"指导日期": `指导日期\s*[:：]\s*([^\r\n]+)`,
		"获奖情况": `获奖情况\s*[:：]\s*([^\r\n]+)`,
	}

	compGuidance := graphql_models.CompGuidancePreview{}

	for key, pattern := range regexPatterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(data)
		if len(matches) > 1 {
			switch key {
			case "项目名称":
				compGuidance.ProjectName = &matches[1]
			case "学生姓名":
				studentNamesStrs := matches[1]
				var studentNames []*string
				if studentNamesStrs != "" {
					for _, studentName := range strings.Split(studentNamesStrs, ",") {
						studentNames = append(studentNames, &studentName)
					}
				}
				compGuidance.StudentNames = studentNames
			case "竞赛成绩":
				compGuidance.CompetitionScore = &matches[1]
			case "指导日期":
				compGuidance.GuidanceDate = parseDate(matches[1])
			case "获奖情况":
				compGuidance.AwardStatus = &matches[1]
			}

		}
	}

	return compGuidance, nil
}

// from string to eduReform
func StringToEduReform(data string, users []*graphql_models.UserExport) (graphql_models.EduReformPreview, error) {

	regexPatterns := map[string]string{
		"项目名称":  `项目名称\s*[:：]\s*([^\r\n]+)`,
		"系统内教师": `系统内教师\s*[:：]\s*([^\r\n]+)`,
		"系统外教师": `系统外教师\s*[:：]\s*([^\r\n]+)`,
		"项目编号":  `项目编号\s*[:：]\s*([^\r\n]+)`,
		"开始日期":  `开始日期\s*[:：]\s*([^\r\n]+)`,
		"持续时间":  `持续时间\s*[:：]\s*([^\r\n]+)`,
		"项目级别":  `项目级别\s*[:：]\s*([^\r\n]+)`,
		"项目排名":  `项目排名\s*[:：]\s*([^\r\n]+)`,
		"项目成果":  `项目成果\s*[:：]\s*([^\r\n]+)`,
		"项目资金":  `项目资金\s*[:：]\s*([^\r\n]+)`,
	}

	usersMap := make(map[string]graphql_models.UserExport)
	for _, user := range users {
		usersMap[user.Username] = *user
	}

	eduReform := graphql_models.EduReformPreview{}

	for key, pattern := range regexPatterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(data)
		if len(matches) > 1 {
			switch key {
			case "项目名称":
				eduReform.Title = &matches[1]
			case "系统内教师":
				teachersInStrs := matches[1]
				var teachersIn []*graphql_models.UserExport
				if teachersInStrs != "" {
					for _, teacherIn := range strings.Split(teachersInStrs, ",") {
						teacherIn = strings.TrimSpace(teacherIn)
						if user, ok := usersMap[teacherIn]; ok {
							teachersIn = append(teachersIn, &user)
						}
					}
				}
				eduReform.TeachersIn = teachersIn
			case "系统外教师":
				teachersOutStrs := matches[1]
				var teachersOut []*string
				if teachersOutStrs != "" {
					for _, teacherOut := range strings.Split(teachersOutStrs, ",") {
						teacherOut = strings.TrimSpace(teacherOut)
						teachersOut = append(teachersOut, &teacherOut)
					}
				}
				eduReform.TeachersOut = teachersOut
			case "项目编号":
				eduReform.Number = &matches[1]
			case "开始日期":
				eduReform.StartDate = parseDate(matches[1])
			case "持续时间":
				eduReform.Duration = &matches[1]
			case "项目级别":
				eduReform.Level = &matches[1]
			case "项目排名":
				eduReform.Rank = &matches[1]
			case "项目成果":
				eduReform.Achievement = &matches[1]
			case "项目资金":
				eduReform.Fund = &matches[1]
			}
		}
	}

	return eduReform, nil
}

// from string to mentorship
func StringToMentorship(data string) (graphql_models.MentorshipPreview, error) {

	regexPatterns := map[string]string{
		"项目名称": `项目名称\s*[:：]\s*([^\r\n]+)`,
		"学生姓名": `学生姓名\s*[:：]\s*([^\r\n]+)`,
		"项目成绩": `项目成绩\s*[:：]\s*([^\r\n]+)`,
		"指导日期": `指导日期\s*[:：]\s*([^\r\n]+)`,
	}

	mentorship := graphql_models.MentorshipPreview{}

	for key, pattern := range regexPatterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(data)
		if len(matches) > 1 {
			switch key {
			case "项目名称":
				mentorship.ProjectName = &matches[1]
			case "学生姓名":
				studentsStrs := matches[1]
				var students []*string
				if studentsStrs != "" {
					for _, student := range strings.Split(studentsStrs, ",") {
						student = strings.TrimSpace(student)
						students = append(students, &student)
					}
				}
				mentorship.StudentNames = students
			case "成绩":
				mentorship.Grade = &matches[1]
			case "指导日期":
				mentorship.GuidanceDate = parseDate(matches[1])
			}
		}
	}

	return mentorship, nil
}

// from string to monograph
func StringToMonograph(data string, users []*graphql_models.UserExport) (graphql_models.MonographPreview, error) {

	regexPatterns := map[string]string{
		"专著名称":  `专著名称\s*[:：]\s*([^\r\n]+)`,
		"系统内教师": `系统内教师\s*[:：]\s*([^\r\n]+)`,
		"系统外教师": `系统外教师\s*[:：]\s*([^\r\n]+)`,
		"出版级别":  `出版级别\s*[:：]\s*([^\r\n]+)`,
		"排名":    `排名\s*[:：]\s*([^\r\n]+)`,
		"出版日期":  `出版日期\s*[:：]\s*([^\r\n]+)`,
	}

	usersMap := make(map[string]graphql_models.UserExport)
	for _, user := range users {
		usersMap[user.Username] = *user
	}

	monograph := graphql_models.MonographPreview{}

	for key, pattern := range regexPatterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(data)
		if len(matches) > 1 {
			switch key {
			case "专著名称":
				monograph.Title = &matches[1]
			case "系统内教师":
				teachersInStrs := matches[1]
				var teachersIn []*graphql_models.UserExport
				if teachersInStrs != "" {
					for _, teacherIn := range strings.Split(teachersInStrs, ",") {
						teacherIn = strings.TrimSpace(teacherIn)
						if user, ok := usersMap[teacherIn]; ok {
							teachersIn = append(teachersIn, &user)
						}
					}
				}
				monograph.TeachersIn = teachersIn
			case "系统外教师":
				teachersOutStrs := matches[1]
				var teachersOut []*string
				if teachersOutStrs != "" {
					for _, teacherOut := range strings.Split(teachersOutStrs, ",") {
						teacherOut = strings.TrimSpace(teacherOut)
						teachersOut = append(teachersOut, &teacherOut)
					}
				}
				monograph.TeachersOut = teachersOut
			case "出版级别":
				monograph.PublishLevel = &matches[1]
			case "排名":
				monograph.Rank = &matches[1]
			case "出版日期":
				monograph.PublishDate = parseDate(matches[1])
			}
		}
	}

	return monograph, nil
}

// from string to paper
func StringToPaper(data string, users []*graphql_models.UserExport) (graphql_models.PaperPreview, error) {

	regexPatterns := map[string]string{
		"系统内教师": `系统内教师\s*[:：]\s*([^\r\n]+)`,
		"系统外教师": `系统外教师\s*[:：]\s*([^\r\n]+)`,
		"论文题目":  `论文题目\s*[:：]\s*([^\r\n]+)`,
		"排名":    `排名排名\s*[:：]\s*([^\r\n]+)`,
		"期刊名称":  `期刊名称\s*[:：]\s*([^\r\n]+)`,
		"期刊级别":  `期刊级别\s*[:：]\s*([^\r\n]+)`,
		"发表日期":  `发表日期\s*[:：]\s*([^\r\n]+)`,
	}

	usersMap := make(map[string]graphql_models.UserExport)
	for _, user := range users {
		usersMap[user.Username] = *user
	}

	paper := graphql_models.PaperPreview{}

	for key, pattern := range regexPatterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(data)
		if len(matches) > 1 {
			switch key {
			case "系统内教师":
				teachersInStrs := matches[1]
				var teachersIn []*graphql_models.UserExport
				if teachersInStrs != "" {
					for _, teacherIn := range strings.Split(teachersInStrs, ",") {
						teacherIn = strings.TrimSpace(teacherIn)
						if user, ok := usersMap[teacherIn]; ok {
							teachersIn = append(teachersIn, &user)
						}
					}
				}
				paper.TeachersIn = teachersIn
			case "系统外教师":
				teachersOutStrs := matches[1]
				var teachersOut []*string
				if teachersOutStrs != "" {
					for _, teacherOut := range strings.Split(teachersOutStrs, ",") {
						teacherOut = strings.TrimSpace(teacherOut)
						teachersOut = append(teachersOut, &teacherOut)
					}
				}
				paper.TeachersOut = teachersOut
			case "论文题目":
				paper.Title = &matches[1]
			case "排名":
				paper.Rank = &matches[1]
			case "期刊名称":
				paper.JournalName = &matches[1]
			case "期刊级别":
				paper.JournalLevel = &matches[1]
			case "发表日期":
				paper.PublishDate = parseDate(matches[1])
			}
		}
	}

	return paper, nil
}

// from string to password
func StringToPassword(data string) (graphql_models.PasswordPreview, error) {

	regexPatterns := map[string]string{
		"网址":   `网址\s*[:：]\s*([^\r\n]+)`,
		"应用名称": `应用名称\s*[:：]\s*([^\r\n]+)`,
		"用户名":  `用户名\s*[:：]\s*([^\r\n]+)`,
		"密码":   `密码\s*[:：]\s*([^\r\n]+)`,
		"描述描述": `描述\s*[:：]\s*([^\r\n]+)`,
	}

	password := graphql_models.PasswordPreview{}

	for key, pattern := range regexPatterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(data)
		if len(matches) > 1 {
			switch key {
			case "网址":
				password.URL = &matches[1]
			case "应用名称":
				password.AppName = &matches[1]
			case "用户名":
				password.Account = &matches[1]
			case "密码":
				password.Password = &matches[1]
			case "描述":
				password.Description = &matches[1]
			}
		}
	}

	return password, nil
}

// from string to sciResearch
func StringToSciResearch(data string, users []*graphql_models.UserExport) (graphql_models.SciResearchPreview, error) {

	regexPatterns := map[string]string{
		"项目名称":  `项目名称\s*[:：]\s*([^\r\n]+)`,
		"系统内教师": `系统内教师\s*[:：]\s*([^\r\n]+)`,
		"系统外教师": `系统外教师\s*[:：]\s*([^\r\n]+)`,
		"项目编号":  `项目编号\s*[:：]\s*([^\r\n]+)`,
		"开始日期":  `开始日期\s*[:：]\s*([^\r\n]+)`,
		"持续时间":  `持续时间\s*[:：]\s*([^\r\n]+)`,
		"项目级别":  `项目级别\s*[:：]\s*([^\r\n]+)`,
		"项目排名":  `项目排名\s*[:：]\s*([^\r\n]+)`,
		"项目成果":  `项目成果\s*[:：]\s*([^\r\n]+)`,
		"项目资金":  `项目资金\s*[:：]\s*([^\r\n]+)`,
		"获奖名称":  `获奖名称\s*[:：]\s*([^\r\n]+)`,
		"获奖排名":  `获奖排名\s*[:：]\s*([^\r\n]+)`,
		"获奖级别":  `获奖级别\s*[:：]\s*([^\r\n]+)`,
		"获奖日期":  `获奖日期\s*[:：]\s*([^\r\n]+)`,
	}

	usersMap := make(map[string]graphql_models.UserExport)
	for _, user := range users {
		usersMap[user.Username] = *user
	}

	sciResearch := graphql_models.SciResearchPreview{}

	var awardName, awardRank, awardLevel, awardDate *string

	for key, pattern := range regexPatterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(data)
		if len(matches) > 1 {
			switch key {
			case "项目名称":
				sciResearch.Title = &matches[1]
			case "系统内教师":
				teachersInStrs := matches[1]
				var teachersIn []*graphql_models.UserExport
				if teachersInStrs != "" {
					for _, teacherIn := range strings.Split(teachersInStrs, ",") {
						teacherIn = strings.TrimSpace(teacherIn)
						if user, ok := usersMap[teacherIn]; ok {
							teachersIn = append(teachersIn, &user)
						}
					}
				}
				sciResearch.TeachersIn = teachersIn
			case "系统外教师":
				teachersOutStrs := matches[1]
				var teachersOut []*string
				if teachersOutStrs != "" {
					for _, teacherOut := range strings.Split(teachersOutStrs, ",") {
						teacherOut = strings.TrimSpace(teacherOut)
						teachersOut = append(teachersOut, &teacherOut)
					}
				}
				sciResearch.TeachersOut = teachersOut
			case "项目编号":
				sciResearch.Number = &matches[1]
			case "开始日期":
				sciResearch.StartDate = parseDate(matches[1])
			case "持续时间":
				sciResearch.Duration = &matches[1]
			case "项目级别":
				sciResearch.Level = &matches[1]
			case "项目排名":
				sciResearch.Rank = &matches[1]
			case "项目成果":
				sciResearch.Achievement = &matches[1]
			case "项目资金":
				sciResearch.Fund = &matches[1]
			case "获奖名称":
				awardName = &matches[1]
			case "获奖排名":
				awardRank = &matches[1]
			case "获奖级别":
				awardLevel = &matches[1]
			case "获奖日期":
				awardDate = &matches[1]
			}

		}
	}

	if awardName != nil || awardRank != nil || awardLevel != nil || awardDate != nil {
		award := &graphql_models.AwardRecordPreview{
			AwardName:  awardName,
			AwardRank:  awardRank,
			AwardLevel: awardLevel,
			AwardDate:  parseDate(*awardDate),
		}
		sciResearch.Awards = append(sciResearch.Awards, award)
	}

	return sciResearch, nil
}

// from string to UGPGGuidance
func StringToUGPGGuidance(data string) (graphql_models.UGPGGuidancePreview, error) {

	regexPatterns := map[string]string{
		"学生姓名":   `学生姓名\s*[:：]\s*([^\r\n]+)`,
		"论文题目":   `论文题目\s*[:：]\s*([^\r\n]+)`,
		"开题检查结果": `开题检查结果\s*[:：]\s*([^\r\n]+)`,
		"中期检查结果": `中期检查结果\s*[:：]\s*([^\r\n]+)`,
		"最终答辩结果": `最终答辩结果\s*[:：]\s*([^\r\n]+)`,
		"开题检查日期": `开题检查日期\s*[:：]\s*([^\r\n]+)`,
		"中期检查日期": `中期检查日期\s*[:：]\s*([^\r\n]+)`,
		"最终答辩日期": `最终答辩日期\s*[:：]\s*([^\r\n]+)`,
	}

	ugpgGuidance := graphql_models.UGPGGuidancePreview{}

	for key, pattern := range regexPatterns {
		re := regexp.MustCompile(pattern)
		matches := re.FindStringSubmatch(data)
		if len(matches) > 1 {
			switch key {
			case "学生姓名":
				ugpgGuidance.StudentName = &matches[1]
			case "论文题目":
				ugpgGuidance.ThesisTopic = &matches[1]
			case "开题检查结果":
				ugpgGuidance.OpeningCheckResult = &matches[1]
			case "中期检查结果":
				ugpgGuidance.MidtermCheckResult = &matches[1]
			case "最终答辩结果":
				ugpgGuidance.DefenseResult = &matches[1]
			case "开题检查日期":
				ugpgGuidance.OpeningCheckDate = parseDate(matches[1])
			case "中期检查日期":
				ugpgGuidance.MidtermCheckDate = parseDate(matches[1])
			case "最终答辩日期":
				ugpgGuidance.DefenseDate = parseDate(matches[1])
			}
		}
	}

	return ugpgGuidance, nil
}
