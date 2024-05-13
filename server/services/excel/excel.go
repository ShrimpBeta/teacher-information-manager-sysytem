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

	return rows, nil
}

func ConvertToCompGuidance(file []byte) ([]graphql_models.CompGuidancePreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	projectNameKey := "项目名称"
	if _, ok := indexMap[projectNameKey]; !ok {
		projectNameKey = "projectName"
	}
	studentNamesKey := "学生姓名"
	if _, ok := indexMap[studentNamesKey]; !ok {
		studentNamesKey = "studentNames"
	}
	competitionScoreKey := "竞赛成绩"
	if _, ok := indexMap[competitionScoreKey]; !ok {
		competitionScoreKey = "competitionScore"
	}
	guidanceDateKey := "指导日期"
	if _, ok := indexMap[guidanceDateKey]; !ok {
		guidanceDateKey = "guidanceDate"
	}
	awardStatusKey := "获奖情况"
	if _, ok := indexMap[awardStatusKey]; !ok {
		awardStatusKey = "awardStatus"
	}

	var compGuidancePreviews []graphql_models.CompGuidancePreview
	for i, data := range datas {
		if i == 0 {
			continue
		}

		projectName := data[indexMap[projectNameKey]]
		studentNamesStrs := strings.Split(data[indexMap[studentNamesKey]], ",")
		var studentNames []*string
		for _, name := range studentNamesStrs {
			name := name
			studentNames = append(studentNames, &name)
		}
		competitionScore := data[indexMap[competitionScoreKey]]
		guidanceDateStr := data[indexMap[guidanceDateKey]]
		guidanceDate, err := time.Parse(time.RFC3339, guidanceDateStr)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		awardStatus := data[indexMap[awardStatusKey]]

		compGuidancePreview := graphql_models.CompGuidancePreview{
			ProjectName:      &projectName,
			StudentNames:     studentNames,
			CompetitionScore: &competitionScore,
			GuidanceDate:     &guidanceDate,
			AwardStatus:      &awardStatus,
		}
		compGuidancePreviews = append(compGuidancePreviews, compGuidancePreview)
	}

	return compGuidancePreviews, nil
}

func ConvertToEduReform(file []byte, users []graphql_models.UserExport) ([]graphql_models.EduReformPreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	titleKey := "项目名称"
	if _, ok := indexMap[titleKey]; !ok {
		titleKey = "title"
	}
	teachersInKey := "系统内教师"
	if _, ok := indexMap[teachersInKey]; !ok {
		teachersInKey = "teachersIn"
	}
	teachersOutKey := "系统外教师"
	if _, ok := indexMap[teachersOutKey]; !ok {
		teachersOutKey = "teachersOut"
	}
	numberkey := "项目编号"
	if _, ok := indexMap[numberkey]; !ok {
		numberkey = "number"
	}
	startDateKey := "开始日期"
	if _, ok := indexMap[startDateKey]; !ok {
		startDateKey = "startDate"
	}
	durationKey := "持续时间"
	if _, ok := indexMap[durationKey]; !ok {
		durationKey = "duration"
	}
	levelKey := "项目级别"
	if _, ok := indexMap[levelKey]; !ok {
		levelKey = "level"
	}
	rankKey := "项目等级"
	if _, ok := indexMap[rankKey]; !ok {
		rankKey = "rank"
	}
	achievementKey := "项目成果"
	if _, ok := indexMap[achievementKey]; !ok {
		achievementKey = "achievement"
	}
	fundKey := "项目资金"
	if _, ok := indexMap[fundKey]; !ok {
		fundKey = "fund"
	}

	usersMap := make(map[string]graphql_models.UserExport)
	for _, user := range users {
		usersMap[user.Username] = user
	}

	var eduReformPreviews []graphql_models.EduReformPreview
	for i, data := range datas {

		if i == 0 {
			continue
		}

		title := data[indexMap[titleKey]]
		teachersInStrs := strings.Split(data[indexMap[teachersInKey]], ",")
		var teachersIn []*graphql_models.UserExport
		for _, name := range teachersInStrs {
			if user, ok := usersMap[name]; ok {
				teachersIn = append(teachersIn, &user)
			}
		}
		teachersOutStrs := strings.Split(data[indexMap[teachersOutKey]], ",")
		var teachersOut []*string
		for _, name := range teachersOutStrs {
			name := name
			teachersOut = append(teachersOut, &name)
		}
		number := data[indexMap[numberkey]]
		startDateStr := data[indexMap[startDateKey]]
		startDate, err := time.Parse(time.RFC3339, startDateStr)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		duration := data[indexMap[durationKey]]
		level := data[indexMap[levelKey]]
		rank := data[indexMap[rankKey]]
		achievement := data[indexMap[achievementKey]]
		fund := data[indexMap[fundKey]]

		eduReformPreview := graphql_models.EduReformPreview{
			Title:       &title,
			TeachersIn:  teachersIn,
			TeachersOut: teachersOut,
			Number:      &number,
			StartDate:   &startDate,
			Duration:    &duration,
			Level:       &level,
			Rank:        &rank,
			Achievement: &achievement,
			Fund:        &fund,
		}
		eduReformPreviews = append(eduReformPreviews, eduReformPreview)
	}

	return eduReformPreviews, nil
}

func ConvertToMentorship(file []byte) ([]graphql_models.MentorshipPreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	projectNameKey := "项目名称"
	if _, ok := indexMap[projectNameKey]; !ok {
		projectNameKey = "projectName"
	}
	studentNamesKey := "学生姓名"
	if _, ok := indexMap[studentNamesKey]; !ok {
		studentNamesKey = "studentNames"
	}
	gradeKey := "成绩"
	if _, ok := indexMap[gradeKey]; !ok {
		gradeKey = "grade"
	}
	guidanceDateKey := "指导日期"
	if _, ok := indexMap[guidanceDateKey]; !ok {
		guidanceDateKey = "guidanceDate"
	}

	var mentorshipPreviews []graphql_models.MentorshipPreview
	for i, data := range datas {

		if i == 0 {
			continue
		}

		projectName := data[indexMap[projectNameKey]]
		studentNamesStrs := strings.Split(data[indexMap[studentNamesKey]], ",")
		var studentNames []*string
		for _, name := range studentNamesStrs {
			name := name
			studentNames = append(studentNames, &name)
		}
		grade := data[indexMap[gradeKey]]
		guidanceDateStr := data[indexMap[guidanceDateKey]]
		guidanceDate, err := time.Parse(time.RFC3339, guidanceDateStr)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		mentorshipPreview := graphql_models.MentorshipPreview{
			ProjectName:  &projectName,
			StudentNames: studentNames,
			Grade:        &grade,
			GuidanceDate: &guidanceDate,
		}
		mentorshipPreviews = append(mentorshipPreviews, mentorshipPreview)
	}

	return mentorshipPreviews, nil
}

func ConvertToMonoGraph(file []byte, users []graphql_models.UserExport) ([]graphql_models.MonographPreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	titleKey := "项目名称"
	if _, ok := indexMap[titleKey]; !ok {
		titleKey = "title"
	}
	teachersInKey := "系统内教师"
	if _, ok := indexMap[teachersInKey]; !ok {
		teachersInKey = "teachersIn"
	}
	teachersOutKey := "系统外教师"
	if _, ok := indexMap[teachersOutKey]; !ok {
		teachersOutKey = "teachersOut"
	}
	publishLevelKey := "出版级别"
	if _, ok := indexMap[publishLevelKey]; !ok {
		publishLevelKey = "publishLevel"
	}
	rankKey := "项目排名"
	if _, ok := indexMap[rankKey]; !ok {
		rankKey = "rank"
	}
	publishDateKey := "出版日期"
	if _, ok := indexMap[publishDateKey]; !ok {
		publishDateKey = "publishDate"
	}

	usersMap := make(map[string]graphql_models.UserExport)
	for _, user := range users {
		usersMap[user.Username] = user
	}

	var monoGraphPreviews []graphql_models.MonographPreview
	for i, data := range datas {

		if i == 0 {
			continue
		}

		title := data[indexMap[titleKey]]
		teachersInStrs := strings.Split(data[indexMap[teachersInKey]], ",")
		var teachersIn []*graphql_models.UserExport
		for _, name := range teachersInStrs {
			if user, ok := usersMap[name]; ok {
				teachersIn = append(teachersIn, &user)
			}
		}
		teachersOutStrs := strings.Split(data[indexMap[teachersOutKey]], ",")
		var teachersOut []*string
		for _, name := range teachersOutStrs {
			name := name
			teachersOut = append(teachersOut, &name)
		}
		publishLevel := data[indexMap[publishLevelKey]]
		rank := data[indexMap[rankKey]]
		publishDateStr := data[indexMap[publishDateKey]]
		publishDate, err := time.Parse(time.RFC3339, publishDateStr)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		monoGraphPreview := graphql_models.MonographPreview{
			Title:        &title,
			TeachersIn:   teachersIn,
			TeachersOut:  teachersOut,
			PublishLevel: &publishLevel,
			Rank:         &rank,
			PublishDate:  &publishDate,
		}
		monoGraphPreviews = append(monoGraphPreviews, monoGraphPreview)
	}

	return monoGraphPreviews, nil
}

func ConvertToPaper(file []byte, users []graphql_models.UserExport) ([]graphql_models.PaperPreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	teachersInKey := "系统内教师"
	if _, ok := indexMap[teachersInKey]; !ok {
		teachersInKey = "teachersIn"
	}
	teachersOutKey := "系统外教师"
	if _, ok := indexMap[teachersOutKey]; !ok {
		teachersOutKey = "teachersOut"
	}
	titleKey := "论文题目"
	if _, ok := indexMap[titleKey]; !ok {
		titleKey = "title"
	}
	rankKey := "论文排名"
	if _, ok := indexMap[rankKey]; !ok {
		rankKey = "rank"
	}
	journalNameKey := "期刊名称"
	if _, ok := indexMap[journalNameKey]; !ok {
		journalNameKey = "journalName"
	}
	journalLevelKey := "期刊级别"
	if _, ok := indexMap[journalLevelKey]; !ok {
		journalLevelKey = "journalLevel"
	}
	publishDateKey := "发表日期"
	if _, ok := indexMap[publishDateKey]; !ok {
		publishDateKey = "publishDate"
	}

	usersMap := make(map[string]graphql_models.UserExport)
	for _, user := range users {
		usersMap[user.Username] = user
	}

	var paperPreviews []graphql_models.PaperPreview
	for i, data := range datas {

		if i == 0 {
			continue
		}

		teachersInStrs := strings.Split(data[indexMap[teachersInKey]], ",")
		var teachersIn []*graphql_models.UserExport
		for _, name := range teachersInStrs {
			if user, ok := usersMap[name]; ok {
				teachersIn = append(teachersIn, &user)
			}
		}
		teachersOutStrs := strings.Split(data[indexMap[teachersOutKey]], ",")
		var teachersOut []*string
		for _, name := range teachersOutStrs {
			name := name
			teachersOut = append(teachersOut, &name)
		}
		title := data[indexMap[titleKey]]
		rank := data[indexMap[rankKey]]
		journalName := data[indexMap[journalNameKey]]
		journalLevel := data[indexMap[journalLevelKey]]
		publishDateStr := data[indexMap[publishDateKey]]
		publishDate, err := time.Parse(time.RFC3339, publishDateStr)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		paperPreview := graphql_models.PaperPreview{
			TeachersIn:   teachersIn,
			TeachersOut:  teachersOut,
			Title:        &title,
			Rank:         &rank,
			JournalName:  &journalName,
			JournalLevel: &journalLevel,
			PublishDate:  &publishDate,
		}
		paperPreviews = append(paperPreviews, paperPreview)
	}

	return paperPreviews, nil
}

func ConvertToPassword(file []byte) ([]graphql_models.PasswordPreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	urlKey := "网址"
	if _, ok := indexMap[urlKey]; !ok {
		urlKey = "url"
	}
	appNameKey := "应用名称"
	if _, ok := indexMap[appNameKey]; !ok {
		appNameKey = "appName"
	}
	accountKey := "用户名"
	if _, ok := indexMap[accountKey]; !ok {
		accountKey = "account"
	}
	passwordKey := "密码"
	if _, ok := indexMap[passwordKey]; !ok {
		passwordKey = "password"
	}
	descriptionKey := "描述"
	if _, ok := indexMap[descriptionKey]; !ok {
		descriptionKey = "description"
	}

	var passwordPreviews []graphql_models.PasswordPreview
	for i, data := range datas {
		if i == 0 {
			continue
		}

		url := data[indexMap[urlKey]]
		appName := data[indexMap[appNameKey]]
		account := data[indexMap[accountKey]]
		password := data[indexMap[passwordKey]]
		description := data[indexMap[descriptionKey]]

		passwordPreview := graphql_models.PasswordPreview{
			URL:         &url,
			AppName:     &appName,
			Account:     &account,
			Password:    &password,
			Description: &description,
		}
		passwordPreviews = append(passwordPreviews, passwordPreview)
	}

	return passwordPreviews, nil
}

func ConvertToSciResearch(file []byte, users []graphql_models.UserExport) ([]graphql_models.SciResearchPreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	titleKey := "项目名称"
	if _, ok := indexMap[titleKey]; !ok {
		titleKey = "title"
	}
	teachersInKey := "系统内教师"
	if _, ok := indexMap[teachersInKey]; !ok {
		teachersInKey = "teachersIn"
	}
	teachersOutKey := "系统外教师"
	if _, ok := indexMap[teachersOutKey]; !ok {
		teachersOutKey = "teachersOut"
	}
	numberKey := "项目编号"
	if _, ok := indexMap[numberKey]; !ok {
		numberKey = "number"
	}
	startDateKey := "开始日期"
	if _, ok := indexMap[startDateKey]; !ok {
		startDateKey = "startDate"
	}
	durationKey := "持续时间"
	if _, ok := indexMap[durationKey]; !ok {
		durationKey = "duration"
	}
	levelKey := "项目级别"
	if _, ok := indexMap[levelKey]; !ok {
		levelKey = "level"
	}
	rankKey := "项目排名"
	if _, ok := indexMap[rankKey]; !ok {
		rankKey = "rank"
	}
	achievementKey := "项目成果"
	if _, ok := indexMap[achievementKey]; !ok {
		achievementKey = "achievement"
	}
	fundKey := "项目资金"
	if _, ok := indexMap[fundKey]; !ok {
		fundKey = "fund"
	}
	awardNameKey := "获奖名称"
	if _, ok := indexMap[awardNameKey]; !ok {
		awardNameKey = "awardName"
	}
	awardLevelKey := "获奖级别"
	if _, ok := indexMap[awardLevelKey]; !ok {
		awardLevelKey = "awardLevel"
	}
	awardRankKey := "获奖排名"
	if _, ok := indexMap[awardRankKey]; !ok {
		awardRankKey = "awardRank"
	}
	awardDateKey := "获奖日期"
	if _, ok := indexMap[awardDateKey]; !ok {
		awardDateKey = "awardDate"
	}

	usersMap := make(map[string]graphql_models.UserExport)
	for _, user := range users {
		usersMap[user.Username] = user
	}

	var sciResearchPreviews []graphql_models.SciResearchPreview
	for i, data := range datas {

		if i == 0 {
			continue
		}

		title := data[indexMap[titleKey]]
		teachersInStrs := strings.Split(data[indexMap[teachersInKey]], ",")
		var teachersIn []*graphql_models.UserExport
		for _, name := range teachersInStrs {
			if user, ok := usersMap[name]; ok {
				teachersIn = append(teachersIn, &user)
			}
		}
		teachersOutStrs := strings.Split(data[indexMap[teachersOutKey]], ",")
		var teachersOut []*string
		for _, name := range teachersOutStrs {
			name := name
			teachersOut = append(teachersOut, &name)
		}
		number := data[indexMap[numberKey]]
		startDateStr := data[indexMap[startDateKey]]
		startDate, err := time.Parse(time.RFC3339, startDateStr)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		duration := data[indexMap[durationKey]]
		level := data[indexMap[levelKey]]
		rank := data[indexMap[rankKey]]
		achievement := data[indexMap[achievementKey]]
		fund := data[indexMap[fundKey]]
		awardName := data[indexMap[awardNameKey]]
		awardLevel := data[indexMap[awardLevelKey]]
		awardRank := data[indexMap[awardRankKey]]
		awardDateStr := data[indexMap[awardDateKey]]
		awardDate, err := time.Parse(time.RFC3339, awardDateStr)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		var awardRecordsPreview []*graphql_models.AwardRecordPreview
		awardRecord := graphql_models.AwardRecordPreview{
			AwardName:  &awardName,
			AwardLevel: &awardLevel,
			AwardRank:  &awardRank,
			AwardDate:  &awardDate,
		}
		awardRecordsPreview = append(awardRecordsPreview, &awardRecord)

		sciResearchPreview := graphql_models.SciResearchPreview{
			Title:       &title,
			TeachersIn:  teachersIn,
			TeachersOut: teachersOut,
			Number:      &number,
			StartDate:   &startDate,
			Duration:    &duration,
			Level:       &level,
			Rank:        &rank,
			Achievement: &achievement,
			Fund:        &fund,
			Awards:      awardRecordsPreview,
		}

		sciResearchPreviews = append(sciResearchPreviews, sciResearchPreview)
	}

	return sciResearchPreviews, nil
}

func ConvertToUGPGGuidance(file []byte) ([]graphql_models.UGPGGuidancePreview, error) {

	datas, err := ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	indexMap := make(map[string]int)
	for i, title := range datas[0] {
		indexMap[title] = i
	}

	studentNameKey := "学生姓名"
	if _, ok := indexMap[studentNameKey]; !ok {
		studentNameKey = "studentName"
	}
	thesisTopicKey := "论文题目"
	if _, ok := indexMap[thesisTopicKey]; !ok {
		thesisTopicKey = "thesisTopic"
	}
	openingCheckResultKey := "开题检查结果"
	if _, ok := indexMap[openingCheckResultKey]; !ok {
		openingCheckResultKey = "openingCheckResult"
	}
	midtermCheckResultKey := "中期检查结果"
	if _, ok := indexMap[midtermCheckResultKey]; !ok {
		midtermCheckResultKey = "midtermCheckResult"
	}
	defenseResultKey := "最终结果"
	if _, ok := indexMap[defenseResultKey]; !ok {
		defenseResultKey = "defenseResult"
	}
	openingCheckDateKey := "开题检查日期"
	if _, ok := indexMap[openingCheckDateKey]; !ok {
		openingCheckDateKey = "openingCheckDate"
	}
	midtermCheckDateKey := "中期检查日期"
	if _, ok := indexMap[midtermCheckDateKey]; !ok {
		midtermCheckDateKey = "midtermCheckDate"
	}
	defenseDateKey := "答辩日期"
	if _, ok := indexMap[defenseDateKey]; !ok {
		defenseDateKey = "defenseDate"
	}

	var ugpgGuidancePreviews []graphql_models.UGPGGuidancePreview
	for i, data := range datas {

		if i == 0 {
			continue
		}

		studentName := data[indexMap[studentNameKey]]
		thesisTopic := data[indexMap[thesisTopicKey]]
		openingCheckResult := data[indexMap[openingCheckResultKey]]
		midtermCheckResult := data[indexMap[midtermCheckResultKey]]
		defenseResult := data[indexMap[defenseResultKey]]
		openingCheckDateStr := data[indexMap[openingCheckDateKey]]
		openingCheckDate, err := time.Parse(time.RFC3339, openingCheckDateStr)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		midtermCheckDateStr := data[indexMap[midtermCheckDateKey]]
		midtermCheckDate, err := time.Parse(time.RFC3339, midtermCheckDateStr)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}
		defenseDateStr := data[indexMap[defenseDateKey]]
		defenseDate, err := time.Parse(time.RFC3339, defenseDateStr)
		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		ugpgGuidancePreview := graphql_models.UGPGGuidancePreview{
			StudentName:        &studentName,
			ThesisTopic:        &thesisTopic,
			OpeningCheckResult: &openingCheckResult,
			MidtermCheckResult: &midtermCheckResult,
			DefenseResult:      &defenseResult,
			OpeningCheckDate:   &openingCheckDate,
			MidtermCheckDate:   &midtermCheckDate,
			DefenseDate:        &defenseDate,
		}
		ugpgGuidancePreviews = append(ugpgGuidancePreviews, ugpgGuidancePreview)
	}

	return ugpgGuidancePreviews, nil
}
