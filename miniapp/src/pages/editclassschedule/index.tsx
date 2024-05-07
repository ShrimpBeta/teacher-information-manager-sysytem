import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { getCurrentInstance } from '@tarojs/runtime'
import { useLazyQuery } from '@apollo/client'
import { academicTermQuery } from '@/graphql/query/classschedule.query.graphql'
import { ClassSchedule, Course } from '@/models/models/classSchedule.model'
import { Button } from '@nutui/nutui-react-taro'
import { ArrowLeft, ArrowRight } from '@nutui/icons-react-taro'

class CourseCell {
  couresId: string | null = null;
  start: number | null = null;
  end: number | null = null;
  teacherNames: string | null = null;
  courseName: string | null = null;
  courseType: string | null = null;
  courseLocation: string | null = null;
  courseWeeks: number[] | null = null;
  studentCount: number | null = null;
  color: string | null = null;
}

function Index() {

  const daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const periods = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三'];

  const [classScheduleQuery] = useLazyQuery(academicTermQuery)

  const [classSchedule, setClassSchedule] = useState<ClassSchedule | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [nowWeek, setNowWeek] = useState<number>(1);
  const [classScheduleMatrix, setClassScheduleMatrix] = useState<CourseCell[][]>(Array(7).fill(null).map(() => Array(periods.length).fill(null)));

  const $instance = getCurrentInstance()

  const getWeekNumber = (startDate: Date): number => {
    let now = new Date();
    let start = new Date(startDate);
    let diffInTime = now.getTime() - start.getTime();
    let diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    let startDay = start.getDay();
    let nowDay = now.getDay();
    let weekNumber = Math.floor(diffInDays / 7);
    if (startDay >= nowDay) weekNumber++;
    return weekNumber;
  }

  useEffect(() => {
    let id = $instance.router?.params.id
    if (id) {
      classScheduleQuery({
        variables: {
          id: id
        }
      }).then((res) => {
        let classSchedule = res.data.academicTerm
        console.log(classSchedule)
        setClassSchedule(classSchedule);
        updateClassScheduleMatrix(classSchedule.courses);
        const week = getWeekNumber(new Date(classSchedule.startDate))
        setNowWeek(week);
        setCurrentWeek(week);
      })
    }
  }, []);

  const updateClassScheduleMatrix = (courses: Course[]) => {
    let matrix: CourseCell[][] = Array(7).fill(null).map(() => Array(periods.length).fill(null));

    for (let course of courses) {
      for (let courseTime of course.courseTimes) {
        let dayOfWeek = courseTime.dayOfWeek;

        let courseCell = new CourseCell();
        courseCell.couresId = course.id;
        courseCell.start = courseTime.start;
        courseCell.end = courseTime.end;
        courseCell.teacherNames = course.teacherNames;
        courseCell.courseName = course.courseName;
        courseCell.courseType = course.courseType;
        courseCell.courseLocation = course.courseLocation;
        courseCell.courseWeeks = course.courseWeeks;
        courseCell.studentCount = course.studentCount;
        courseCell.color = course.color;

        for (let i = courseTime.start - 1; i < courseTime.end; i++) {
          matrix[dayOfWeek - 1][i] = courseCell;
        }
      }
    }

    console.log(matrix)
    setClassScheduleMatrix(matrix);
  }

  return (
    <View className="container">
      {classSchedule &&
        <>
          <View style={{ width: '100%', height: '120rpx', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button fill="none" style={{ margin: '8' }} disabled={currentWeek == 1} onClick={() => { if (currentWeek > 1) { setCurrentWeek(currentWeek - 1) } }}>
              <ArrowLeft />
            </Button>
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <View>{classSchedule.termName}</View>
              <View>第 {currentWeek} 周</View>
              {nowWeek !== currentWeek && <View>当前为第 {nowWeek} 周</View>}
            </View>
            <Button fill="none" style={{ margin: '8' }} disabled={currentWeek == classSchedule.weekCount} onClick={() => { if (currentWeek < classSchedule.weekCount) { setCurrentWeek(currentWeek + 1) } }}>
              <ArrowRight />
            </Button>
          </View>

          <View style={{ height: '2500rpx', overflow: 'auto' }}>
            <View style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
              <View style={{ display: 'flex', flexDirection: 'column', flex: '1', borderRight: '1px solid #b7c9e9', borderLeft: '1px solid #b7c9e9' }}>
                <View style={{ flex: '0.5', borderBottom: '1px solid #b7c9e9', borderTop: '1px solid #b7c9e9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>时间</View>
                {periods.map((period, periodIndex) => {
                  return <View key={periodIndex} style={{ flex: '1', borderBottom: '1px solid #b7c9e9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{period}</View>
                })}
              </View>
              {daysOfWeek.map((dayOfWeek, dayOfWeekIndex) => {
                return (
                  <View key={dayOfWeekIndex} style={{ display: 'flex', flexDirection: 'column', flex: '1', borderRight: '1px solid #b7c9e9' }}>
                    <View style={{ flex: '0.5', borderBottom: '1px solid #b7c9e9', borderTop: '1px solid #b7c9e9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{dayOfWeek}</View>
                    {periods.map((period, periodIndex) => {
                      let courseCell = classScheduleMatrix[dayOfWeekIndex][periodIndex];
                      if (courseCell === null || courseCell === undefined) {
                        return <View key={periodIndex} style={{ flex: '1', borderBottom: '1px solid #b7c9e9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}></View>
                      }
                      if (courseCell.start === periodIndex + 1 && courseCell.courseWeeks?.includes(currentWeek)) {
                        return (
                          <View key={periodIndex} style={{ flex: courseCell.end! - courseCell.start! + 1, backgroundColor: courseCell.color!, borderBottom: '1px solid #b7c9e9', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20rpx', color: 'white' }}>
                            {courseCell &&
                              <View>
                                <View style={{ wordBreak: 'break-all' }}>{courseCell.courseName}</View>
                                <View style={{ wordBreak: 'break-all' }}>{courseCell.courseLocation}</View>
                                <View style={{ wordBreak: 'break-all' }}>{courseCell.teacherNames}</View>
                              </View>
                            }
                          </View>
                        )
                      } else if (!courseCell.courseWeeks?.includes(currentWeek)) {
                        return <View key={periodIndex} style={{ flex: '1', borderBottom: '1px solid #b7c9e9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}></View>
                      }
                    })}
                  </View>
                )
              })}
            </View>
          </View>
        </>
      }
    </View>
  )
}

export default Index
