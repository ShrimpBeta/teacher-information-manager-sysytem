import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { map, Observable } from "rxjs";
import { AcademicTermResponse, AcademicTermsByFilterResponse, AcademicTermsResponse, ClassSchedule, ClassScheduleFilter, ClassSchedulePage, Course, CreateAcademicResponse, CreateCourseResponse, DeleteAcademicResponse, DeleteCourseResponse, EditClassSchedule, EditCourse, UpdateAcademicResponse, UpdateCourseResponse } from "../models/models/classSchedule.model";
import { academicTermQuery, academicTermsByIdsQuery, academicTermsShortByFilterQuery } from "../models/graphql/query/classschedule.query.graphql";
import { createAcademicTermMutation, createCourseMutation, deleteAcademicTermMutation, deleteCourseMutation, updateAcademicTerm, updateCourseMutation } from "../models/graphql/mutation/classschedule.mutation.graphql";

@Injectable({
  providedIn: 'root'
})
export class ClassScheduleService {

  constructor(
    private apollo: Apollo,
  ) { }

  getClassSchedule(id: string): Observable<ClassSchedule | null> {
    return this.apollo.query({
      query: academicTermQuery,
      variables: {
        id: id
      }
    }).pipe(
      map(result => {
        let classSchedule = (result as AcademicTermResponse).data?.academicTerm;
        if (typeof classSchedule === 'undefined' || classSchedule === null) {
          return null;
        }
        return classSchedule;
      })
    );
  }

  getClassSchedules(ids: string[]): Observable<ClassSchedule[] | null> {
    return this.apollo.query({
      query: academicTermsByIdsQuery,
      variables: {
        ids: ids
      }
    })
      .pipe(
        map(result => {
          let classSchedules = (result as AcademicTermsResponse).data?.AcademicTerms;
          if (typeof classSchedules === 'undefined' || classSchedules === null) {
            return null;
          }
          return classSchedules;
        })
      )
  }

  getClassSchedulesByFilter(classScheduleFilter: ClassScheduleFilter, pageIndex: number, pageSize: number): Observable<ClassSchedulePage | null> {
    return this.apollo.query({
      query: academicTermsShortByFilterQuery,
      variables: {
        filter: classScheduleFilter,
        offset: pageIndex * pageSize,
        limit: pageSize
      },
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => {
        console.log(result);
        let classSchedulePage = (result as AcademicTermsByFilterResponse).data?.academicTermsByFilter;
        if (typeof classSchedulePage === 'undefined' || classSchedulePage === null) {
          return null;
        }
        return classSchedulePage;
      })
    );
  }

  createClassSchedule(newClassSchedule: EditClassSchedule): Observable<ClassSchedule | null> {
    return this.apollo.mutate({
      mutation: createAcademicTermMutation,
      variables: {
        termData: newClassSchedule
      }
    }).pipe(
      map(result => {
        let classSchedule = (result as CreateAcademicResponse).data?.createAcademicTerm;
        if (typeof classSchedule === 'undefined' || classSchedule === null) {
          return null;
        }
        return classSchedule;
      })
    );
  }

  updateClassSchedule(termId: string, updatedClassSchedule: EditClassSchedule): Observable<ClassSchedule | null> {
    return this.apollo.mutate({
      mutation: updateAcademicTerm,
      variables: {
        termId: termId,
        termData: {
          termName: updatedClassSchedule.termName,
          startDate: updatedClassSchedule.startDate,
          weekCount: updatedClassSchedule.weekCount
        }
      }
    }).pipe(
      map(result => {
        let classSchedule = (result as UpdateAcademicResponse).data?.updateAcademicTerm;
        if (typeof classSchedule === 'undefined' || classSchedule === null) {
          return null;
        }
        return classSchedule;
      })
    );
  }

  deleteClassSchedule(id: string): Observable<ClassSchedule | null> {
    return this.apollo.mutate({
      mutation: deleteAcademicTermMutation,
      variables: {
        termId: id
      }
    }).pipe(
      map(result => {
        let classSchedule = (result as DeleteAcademicResponse).data?.deleteAcademicTerm;
        if (typeof classSchedule === 'undefined' || classSchedule === null) {
          return null;
        }
        return classSchedule;
      })
    );
  }

  createCourse(termId: string, newCourse: EditCourse): Observable<Course | null> {
    return this.apollo.mutate({
      mutation: createCourseMutation,
      variables: {
        termId: termId,
        courseData: newCourse
      }
    }).pipe(
      map(result => {
        let course = (result as CreateCourseResponse).data?.createCourse;
        if (typeof course === 'undefined' || course === null) {
          return null;
        }
        return course;
      })
    );
  }

  updateCourse(termId: string, courseId: string, updatedCourse: EditCourse): Observable<Course | null> {
    return this.apollo.mutate({
      mutation: updateCourseMutation,
      variables: {
        termId: termId,
        courseId: courseId,
        courseData: updatedCourse
      }
    }).pipe(
      map(result => {
        let course = (result as UpdateCourseResponse).data?.updateCourse;
        if (typeof course === 'undefined' || course === null) {
          return null;
        }
        return course;
      })
    );
  }

  deleteCourse(termId: string, courseId: string): Observable<Course | null> {
    return this.apollo.mutate({
      mutation: deleteCourseMutation,
      variables: {
        termId: termId,
        courseId: courseId
      }
    }).pipe(
      map(result => {
        let course = (result as DeleteCourseResponse).data?.deleteCourse;
        if (typeof course === 'undefined' || course === null) {
          return null;
        }
        return course;
      })
    );
  }
}
