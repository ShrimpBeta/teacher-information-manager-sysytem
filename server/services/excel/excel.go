package excel

import (
	"bytes"
	"fmt"
	graphql_models "server/graph/model"
	"strings"
	"time"

	"github.com/xuri/excelize/v2"
)

func ReadFile(file []byte) ([][]string, error) {

	// 将文件内容转换为bytes.Reader对象
	reader := bytes.NewReader(file)

	// 使用excelize.OpenReader从内存中打开Excel文件
	f, err := excelize.OpenReader(reader)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	defer f.Close()

	// 默认读取Sheet1中的数据
	SheetName := f.GetSheetName(0)
	rows, err := f.GetRows(SheetName)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	if len(rows) == 0 {
		return nil, fmt.Errorf("sheet is empty")
	}

	// 获取标题行的长度
	titleLength := len(rows[0])

	// 确保每行的长度与标题行一致
	for i, row := range rows {
		if len(row) < titleLength {
			// 不足的部分用空字符串填充
			rows[i] = append(row, make([]string, titleLength-len(row))...)
		}
	}

	return rows, nil
}

func parseTimeOrNil(timeStr string) *time.Time {
	if timeStr == "" {
		return nil
	}
	t, err := time.Parse(time.RFC3339, timeStr)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	return &t
}

func ConvertToCompGuidance(file []byte) ([]*graphql_models.CompGuidancePreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	safeGetData := func(data []string, key string) string {
		if index, ok := indexMap[key]; ok {
			return data[index]
		}
		return ""
	}

	var compGuidancePreviews []*graphql_models.CompGuidancePreview
	for i, data := range datas {
		if i == 0 {
			continue
		}

		projectName := safeGetData(data, "项目名称")
		if projectName == "" {
			projectName = safeGetData(data, "projectName")
		}
		studentNamesStrs := safeGetData(data, "学生姓名")
		if studentNamesStrs == "" {
			studentNamesStrs = safeGetData(data, "studentNames")
		}
		var studentNames []*string
		if studentNamesStrs != "" {
			for _, name := range strings.Split(studentNamesStrs, ",") {
				tempName := name
				studentNames = append(studentNames, &tempName)
			}
		}
		competitionScore := safeGetData(data, "竞赛成绩")
		if competitionScore == "" {
			competitionScore = safeGetData(data, "competitionScore")
		}
		guidanceDateStr := safeGetData(data, "指导日期")
		if guidanceDateStr == "" {
			guidanceDateStr = safeGetData(data, "guidanceDate")
		}
		guidanceDate := parseTimeOrNil(guidanceDateStr)
		awardStatus := safeGetData(data, "获奖情况")
		if awardStatus == "" {
			awardStatus = safeGetData(data, "awardStatus")
		}

		compGuidancePreview := graphql_models.CompGuidancePreview{
			ProjectName:      &projectName,
			StudentNames:     studentNames,
			CompetitionScore: &competitionScore,
			GuidanceDate:     guidanceDate,
			AwardStatus:      &awardStatus,
		}
		compGuidancePreviews = append(compGuidancePreviews, &compGuidancePreview)
	}

	return compGuidancePreviews, nil
}

func ConvertToEduReform(file []byte, users []*graphql_models.UserExport) ([]*graphql_models.EduReformPreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	safeGetData := func(data []string, key string) string {
		if index, ok := indexMap[key]; ok {
			return data[index]
		}
		return ""
	}

	usersMap := make(map[string]graphql_models.UserExport)
	for _, user := range users {
		usersMap[user.Username] = *user
	}

	var eduReformPreviews []*graphql_models.EduReformPreview
	for i, data := range datas {

		if i == 0 {
			continue
		}

		title := safeGetData(data, "项目名称")
		if title == "" {
			title = safeGetData(data, "title")
		}
		teachersInStrs := safeGetData(data, "系统内教师")
		if teachersInStrs == "" {
			teachersInStrs = safeGetData(data, "teachersIn")
		}
		var teachersIn []*graphql_models.UserExport
		if teachersInStrs != "" {
			for _, name := range strings.Split(teachersInStrs, ",") {
				if user, ok := usersMap[name]; ok {
					teachersIn = append(teachersIn, &user)
				}
			}
		}
		teachersOutStrs := safeGetData(data, "系统外教师")
		if teachersOutStrs == "" {
			teachersOutStrs = safeGetData(data, "teachersOut")
		}
		var teachersOut []*string
		if teachersOutStrs != "" {
			for _, name := range strings.Split(teachersOutStrs, ",") {
				tempName := name
				teachersOut = append(teachersOut, &tempName)
			}
		}
		number := safeGetData(data, "项目编号")
		if number == "" {
			number = safeGetData(data, "number")
		}
		startDateStr := safeGetData(data, "开始日期")
		if startDateStr == "" {
			startDateStr = safeGetData(data, "startDate")
		}
		startDate := parseTimeOrNil(startDateStr)
		duration := safeGetData(data, "持续时间")
		if duration == "" {
			duration = safeGetData(data, "duration")
		}
		level := safeGetData(data, "项目级别")
		if level == "" {
			level = safeGetData(data, "level")
		}
		rank := safeGetData(data, "项目排名")
		if rank == "" {
			rank = safeGetData(data, "rank")
		}
		achievement := safeGetData(data, "项目成果")
		if achievement == "" {
			achievement = safeGetData(data, "achievement")
		}
		fund := safeGetData(data, "项目资金")
		if fund == "" {
			fund = safeGetData(data, "fund")
		}

		eduReformPreview := graphql_models.EduReformPreview{
			Title:       &title,
			TeachersIn:  teachersIn,
			TeachersOut: teachersOut,
			Number:      &number,
			StartDate:   startDate,
			Duration:    &duration,
			Level:       &level,
			Rank:        &rank,
			Achievement: &achievement,
			Fund:        &fund,
		}
		eduReformPreviews = append(eduReformPreviews, &eduReformPreview)
	}

	return eduReformPreviews, nil
}

func ConvertToMentorship(file []byte) ([]*graphql_models.MentorshipPreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	safeGetData := func(data []string, key string) string {
		if index, ok := indexMap[key]; ok {
			return data[index]
		}
		return ""
	}

	var mentorshipPreviews []*graphql_models.MentorshipPreview
	for i, data := range datas {

		if i == 0 {
			continue
		}

		projectName := safeGetData(data, "项目名称")
		if projectName == "" {
			projectName = safeGetData(data, "projectName")
		}

		studentNamesStrs := safeGetData(data, "学生姓名")
		if studentNamesStrs == "" {
			studentNamesStrs = safeGetData(data, "studentNames")
		}
		var studentNames []*string
		if studentNamesStrs != "" {
			for _, name := range strings.Split(studentNamesStrs, ",") {
				tempName := name
				studentNames = append(studentNames, &tempName)
			}
		}
		grade := safeGetData(data, "项目成绩")
		if grade == "" {
			grade = safeGetData(data, "grade")
		}
		guidanceDateStr := safeGetData(data, "指导日期")
		if guidanceDateStr == "" {
			guidanceDateStr = safeGetData(data, "guidanceDate")
		}
		guidanceDate := parseTimeOrNil(guidanceDateStr)

		mentorshipPreview := graphql_models.MentorshipPreview{
			ProjectName:  &projectName,
			StudentNames: studentNames,
			Grade:        &grade,
			GuidanceDate: guidanceDate,
		}
		mentorshipPreviews = append(mentorshipPreviews, &mentorshipPreview)
	}

	return mentorshipPreviews, nil
}

func ConvertToMonograph(file []byte, users []*graphql_models.UserExport) ([]*graphql_models.MonographPreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	safeGetData := func(data []string, key string) string {
		if index, ok := indexMap[key]; ok {
			return data[index]
		}
		return ""
	}

	usersMap := make(map[string]graphql_models.UserExport)
	for _, user := range users {
		usersMap[user.Username] = *user
	}

	var monoGraphPreviews []*graphql_models.MonographPreview
	for i, data := range datas {

		if i == 0 {
			continue
		}

		title := safeGetData(data, "专著名称")
		if title == "" {
			title = safeGetData(data, "title")
		}
		teachersInStrs := safeGetData(data, "系统内教师")
		if teachersInStrs == "" {
			teachersInStrs = safeGetData(data, "teachersIn")
		}
		var teachersIn []*graphql_models.UserExport
		if teachersInStrs != "" {
			for _, name := range strings.Split(teachersInStrs, ",") {
				if user, ok := usersMap[name]; ok {
					teachersIn = append(teachersIn, &user)
				}
			}
		}
		teachersOutStrs := safeGetData(data, "系统外教师")
		if teachersOutStrs == "" {
			teachersOutStrs = safeGetData(data, "teachersOut")
		}
		var teachersOut []*string
		if teachersOutStrs != "" {
			for _, name := range strings.Split(teachersOutStrs, ",") {
				tempName := name
				teachersOut = append(teachersOut, &tempName)
			}
		}
		publishLevel := safeGetData(data, "出版级别")
		if publishLevel == "" {
			publishLevel = safeGetData(data, "publishLevel")
		}
		rank := safeGetData(data, "排名")
		if rank == "" {
			rank = safeGetData(data, "rank")
		}
		publishDateStr := safeGetData(data, "出版日期")
		if publishDateStr == "" {
			publishDateStr = safeGetData(data, "publishDate")
		}
		publishDate := parseTimeOrNil(publishDateStr)

		monoGraphPreview := graphql_models.MonographPreview{
			Title:        &title,
			TeachersIn:   teachersIn,
			TeachersOut:  teachersOut,
			PublishLevel: &publishLevel,
			Rank:         &rank,
			PublishDate:  publishDate,
		}
		monoGraphPreviews = append(monoGraphPreviews, &monoGraphPreview)
	}

	return monoGraphPreviews, nil
}

func ConvertToPaper(file []byte, users []*graphql_models.UserExport) ([]*graphql_models.PaperPreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	safeGetData := func(data []string, key string) string {
		if index, ok := indexMap[key]; ok {
			return data[index]
		}
		return ""
	}

	usersMap := make(map[string]graphql_models.UserExport)
	for _, user := range users {
		usersMap[user.Username] = *user
	}

	var paperPreviews []*graphql_models.PaperPreview
	for i, data := range datas {

		if i == 0 {
			continue
		}

		teachersInStrs := safeGetData(data, "系统内教师")
		if teachersInStrs == "" {
			teachersInStrs = safeGetData(data, "teachersIn")
		}
		var teachersIn []*graphql_models.UserExport
		if teachersInStrs != "" {
			for _, name := range strings.Split(teachersInStrs, ",") {
				if user, ok := usersMap[name]; ok {
					teachersIn = append(teachersIn, &user)
				}
			}
		}
		teachersOutStrs := safeGetData(data, "系统外教师")
		if teachersOutStrs == "" {
			teachersOutStrs = safeGetData(data, "teachersOut")
		}
		var teachersOut []*string
		if teachersOutStrs != "" {
			for _, name := range strings.Split(teachersOutStrs, ",") {
				tempName := name
				teachersOut = append(teachersOut, &tempName)
			}
		}
		title := safeGetData(data, "论文题目")
		if title == "" {
			title = safeGetData(data, "title")
		}
		rank := safeGetData(data, "排名")
		if rank == "" {
			rank = safeGetData(data, "rank")
		}
		journalName := safeGetData(data, "期刊名称")
		if journalName == "" {
			journalName = safeGetData(data, "journalName")
		}
		journalLevel := safeGetData(data, "期刊级别")
		if journalLevel == "" {
			journalLevel = safeGetData(data, "journalLevel")
		}
		publishDateStr := safeGetData(data, "发表日期")
		if publishDateStr == "" {
			publishDateStr = safeGetData(data, "publishDate")
		}
		publishDate := parseTimeOrNil(publishDateStr)

		paperPreview := graphql_models.PaperPreview{
			TeachersIn:   teachersIn,
			TeachersOut:  teachersOut,
			Title:        &title,
			Rank:         &rank,
			JournalName:  &journalName,
			JournalLevel: &journalLevel,
			PublishDate:  publishDate,
		}
		paperPreviews = append(paperPreviews, &paperPreview)
	}

	return paperPreviews, nil
}

func ConvertToPassword(file []byte) ([]*graphql_models.PasswordPreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	safeGetData := func(data []string, key string) string {
		if index, ok := indexMap[key]; ok {
			return data[index]
		}
		return ""
	}

	var passwordPreviews []*graphql_models.PasswordPreview
	for i, data := range datas {
		if i == 0 {
			continue
		}

		url := safeGetData(data, "网址")
		if url == "" {
			url = safeGetData(data, "url")
		}
		appName := safeGetData(data, "应用名称")
		if appName == "" {
			appName = safeGetData(data, "appName")
		}
		account := safeGetData(data, "用户名")
		if account == "" {
			account = safeGetData(data, "account")
		}
		password := safeGetData(data, "密码")
		if password == "" {
			password = safeGetData(data, "password")
		}
		description := safeGetData(data, "描述")
		if description == "" {
			description = safeGetData(data, "description")
		}

		passwordPreview := graphql_models.PasswordPreview{
			URL:         &url,
			AppName:     &appName,
			Account:     &account,
			Password:    &password,
			Description: &description,
		}
		passwordPreviews = append(passwordPreviews, &passwordPreview)
	}

	return passwordPreviews, nil
}

func ConvertToSciResearch(file []byte, users []*graphql_models.UserExport) ([]*graphql_models.SciResearchPreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	safeGetData := func(data []string, key string) string {
		if index, ok := indexMap[key]; ok {
			return data[index]
		}
		return ""
	}

	usersMap := make(map[string]graphql_models.UserExport)
	for _, user := range users {
		usersMap[user.Username] = *user
	}

	var sciResearchPreviews []*graphql_models.SciResearchPreview
	for i, data := range datas {

		if i == 0 {
			continue
		}

		title := safeGetData(data, "项目名称")
		if title == "" {
			title = safeGetData(data, "title")
		}
		teachersInStrs := safeGetData(data, "系统内教师")
		if teachersInStrs == "" {
			teachersInStrs = safeGetData(data, "teachersIn")
		}
		var teachersIn []*graphql_models.UserExport
		if teachersInStrs != "" {
			for _, name := range strings.Split(teachersInStrs, ",") {
				if user, ok := usersMap[name]; ok {
					teachersIn = append(teachersIn, &user)
				}
			}
		}
		teachersOutStrs := safeGetData(data, "系统外教师")
		if teachersOutStrs == "" {
			teachersOutStrs = safeGetData(data, "teachersOut")
		}
		var teachersOut []*string
		if teachersOutStrs != "" {
			for _, name := range strings.Split(teachersOutStrs, ",") {
				tempName := name
				teachersOut = append(teachersOut, &tempName)
			}
		}
		number := safeGetData(data, "项目编号")
		if number == "" {
			number = safeGetData(data, "number")
		}
		startDateStr := safeGetData(data, "开始日期")
		if startDateStr == "" {
			startDateStr = safeGetData(data, "startDate")
		}
		startDate := parseTimeOrNil(startDateStr)
		duration := safeGetData(data, "持续时间")
		if duration == "" {
			duration = safeGetData(data, "duration")
		}
		level := safeGetData(data, "项目级别")
		if level == "" {
			level = safeGetData(data, "level")
		}
		rank := safeGetData(data, "项目排名")
		if rank == "" {
			rank = safeGetData(data, "rank")
		}
		achievement := safeGetData(data, "项目成果")
		if achievement == "" {
			achievement = safeGetData(data, "achievement")
		}
		fund := safeGetData(data, "项目资金")
		if fund == "" {
			fund = safeGetData(data, "fund")
		}
		awardName := safeGetData(data, "获奖名称")
		if awardName == "" {
			awardName = safeGetData(data, "awardName")
		}
		awardLevel := safeGetData(data, "获奖级别")
		if awardLevel == "" {
			awardLevel = safeGetData(data, "awardLevel")
		}
		awardRank := safeGetData(data, "获奖排名")
		if awardRank == "" {
			awardRank = safeGetData(data, "awardRank")
		}
		awardDateStr := safeGetData(data, "获奖日期")
		if awardDateStr == "" {
			awardDateStr = safeGetData(data, "awardDate")
		}
		awardDate := parseTimeOrNil(awardDateStr)

		var awardRecordsPreview []*graphql_models.AwardRecordPreview
		if awardName != "" || awardLevel != "" || awardRank != "" || awardDate != nil {
			awardRecord := graphql_models.AwardRecordPreview{
				AwardName:  &awardName,
				AwardLevel: &awardLevel,
				AwardRank:  &awardRank,
				AwardDate:  awardDate,
			}
			awardRecordsPreview = append(awardRecordsPreview, &awardRecord)
		}

		sciResearchPreview := graphql_models.SciResearchPreview{
			Title:       &title,
			TeachersIn:  teachersIn,
			TeachersOut: teachersOut,
			Number:      &number,
			StartDate:   startDate,
			Duration:    &duration,
			Level:       &level,
			Rank:        &rank,
			Achievement: &achievement,
			Fund:        &fund,
			Awards:      awardRecordsPreview,
		}

		sciResearchPreviews = append(sciResearchPreviews, &sciResearchPreview)
	}

	return sciResearchPreviews, nil
}

func ConvertToUGPGGuidance(file []byte) ([]*graphql_models.UGPGGuidancePreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	safeGetData := func(data []string, key string) string {
		if index, ok := indexMap[key]; ok {
			return data[index]
		}
		return ""
	}

	var ugpgGuidancePreviews []*graphql_models.UGPGGuidancePreview
	for i, data := range datas {

		if i == 0 {
			continue
		}

		studentName := safeGetData(data, "学生姓名")
		if studentName == "" {
			studentName = safeGetData(data, "studentName")
		}
		thesisTopic := safeGetData(data, "论文题目")
		if thesisTopic == "" {
			thesisTopic = safeGetData(data, "thesisTopic")
		}
		openingCheckResult := safeGetData(data, "开题检查结果")
		if openingCheckResult == "" {
			openingCheckResult = safeGetData(data, "openingCheckResult")
		}
		midtermCheckResult := safeGetData(data, "中期检查结果")
		if midtermCheckResult == "" {
			midtermCheckResult = safeGetData(data, "midtermCheckResult")
		}
		defenseResult := safeGetData(data, "最终答辩结果")
		if defenseResult == "" {
			defenseResult = safeGetData(data, "defenseResult")
		}
		openingCheckDateStr := safeGetData(data, "开题检查日期")
		if openingCheckDateStr == "" {
			openingCheckDateStr = safeGetData(data, "openingCheckDate")
		}
		openingCheckDate := parseTimeOrNil(openingCheckDateStr)
		midtermCheckDateStr := safeGetData(data, "中期检查日期")
		if midtermCheckDateStr == "" {
			midtermCheckDateStr = safeGetData(data, "midtermCheckDate")
		}
		midtermCheckDate := parseTimeOrNil(midtermCheckDateStr)
		defenseDateStr := safeGetData(data, "最终答辩日期")
		defenseDate := parseTimeOrNil(defenseDateStr)

		ugpgGuidancePreview := graphql_models.UGPGGuidancePreview{
			StudentName:        &studentName,
			ThesisTopic:        &thesisTopic,
			OpeningCheckResult: &openingCheckResult,
			MidtermCheckResult: &midtermCheckResult,
			DefenseResult:      &defenseResult,
			OpeningCheckDate:   openingCheckDate,
			MidtermCheckDate:   midtermCheckDate,
			DefenseDate:        defenseDate,
		}
		ugpgGuidancePreviews = append(ugpgGuidancePreviews, &ugpgGuidancePreview)
	}

	return ugpgGuidancePreviews, nil
}
