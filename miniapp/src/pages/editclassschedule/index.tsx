import React, { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import './index.scss'
import { getCurrentInstance } from '@tarojs/runtime'
import { useLazyQuery, useMutation } from '@apollo/client'
import { createCourseMutation, deleteCourseMutation, updateAcademicTerm, updateCourseMutation } from '@/graphql/mutation/classschedule.mutation.graphql'
import { academicTermQuery } from '@/graphql/query/classschedule.query.graphql'
import { ClassSchedule, Course } from '@/models/models/classSchedule.model'

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

  const [updateClassSchedule] = useMutation(updateAcademicTerm);
  const [crateCourse] = useMutation(createCourseMutation);
  const [updateCourse] = useMutation(updateCourseMutation);
  const [deleteCourse] = useMutation(deleteCourseMutation);
  const [classScheduleQuery] = useLazyQuery(academicTermQuery)

  const [classSchedule, setClassSchedule] = useState<ClassSchedule | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [nowWeek, setNowWeek] = useState<number>(1);
  const [classScheduleMatrix, setClassScheduleMatrix] = useState<CourseCell[][]>(Array(7).fill(null).map(() => Array(periods.length).fill(null)));

  const $instance = getCurrentInstance()

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
          <View></View>
          <View>
            <View className='table'>
              <View className='thead'>
                <View className='tr'>
                  <View className='th'>时间</View>
                  {daysOfWeek.map((dayOfWeek, index) => {
                    return <View key={index} className='th'>{dayOfWeek}</View>
                  })}
                </View>
              </View>
              <View className='tbody'>
                {periods.map((period, periodIndex) => {
                  return (
                    <View key={periodIndex} className='tr'>
                      <View className='td'>{period}</View>
                      {daysOfWeek.map((dayOfWeek, dayOfWeekIndex) => {
                        let courseCell = classScheduleMatrix[dayOfWeekIndex][periodIndex];
                        if (courseCell === null || courseCell === undefined) {
                          return <View key={dayOfWeekIndex} className='td'></View>
                        }
                        if (courseCell.start === periodIndex + 1 && courseCell.courseWeeks?.includes(currentWeek)) {
                          return (
                            <View key={dayOfWeekIndex} className='td' style={{ flex: courseCell.end! - courseCell.start! + 1, backgroundColor: courseCell.color! }}>
                              {courseCell &&
                                <View>
                                  <View>{courseCell.courseName}</View>
                                  <View>{courseCell.courseLocation}</View>
                                  <View>{courseCell.teacherNames}</View>
                                </View>
                              }
                            </View>
                          )
                        } else if (!courseCell.courseWeeks?.includes(currentWeek)) {
                          return <View key={dayOfWeekIndex} className='td'></View>
                        }
                      })}
                    </View>
                  )
                })}
              </View>
            </View>
          </View>
        </>
      }
    </View>
  )
}

export default Index
