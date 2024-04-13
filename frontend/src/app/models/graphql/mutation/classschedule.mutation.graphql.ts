import { gql } from "apollo-angular";

export const createAcademicTermMutation = gql`
  mutation createAcademicTerm($termData: NewAcademicTerm!) {
    createAcademicTerm(termData: $termData) {
      id
      termName
      startDate
      weekCount
      courses{
        id
        teacherNames
        courseName
        courseLocation
        courseType
        courseWeeks
        classTimes{
          dayOfWeek
          start
          end
        }
        studentCount
        color
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateAcademicTerm = gql`
  mutation updateAcademicTerm($termId:ID!,$termData:UpdateAcademicTerm!){
    updateAcademicTerm(termId: $termId,termData: $termData){
      id
      termName
      startDate
      weekCount
      courses{
        id
        teacherNames
        courseName
        courseLocation
        courseType
        courseWeeks
        classTimes{
          dayOfWeek
          start
          end
        }
        studentCount
        color
      }
      createdAt
      updatedAt
    }
  }
`;

export const deleteAcademicTermMutation = gql`
  mutation deleteAcademicTerm($termId:ID!){
    deleteAcademicTerm(termId: $termId){
      id
      termName
      startDate
      weekCount
      courses{
        id
        teacherNames
        courseName
        courseLocation
        courseType
        courseWeeks
        classTimes{
          dayOfWeek
          start
          end
        }
        studentCount
        color
      }
      createdAt
      updatedAt
    }
  }
`;

export const createCourseMutation = gql`
  mutation createCourse($termId:ID!,$courseData:CourseData!){
    createCourse(termId: $termId,courseData: $courseData){
      id
      teacherNames
      courseName
      courseLocation
      courseType
      courseWeeks
      classTimes{
        dayOfWeek
        start
        end
      }
      studentCount
      color
    }
  }
`;

export const updateCourseMutation = gql`
  mutation updateCourse($termId:ID!,$courseId:ID!,$courseData:CourseData!){
    updateCourse(termId: $termId,courseId: $courseId,courseData: $courseData){
      id
      teacherNames
      courseName
      courseLocation
      courseType
      courseWeeks
      classTimes{
        dayOfWeek
        start
        end
      }
      studentCount
      color
    }
  }
`;

export const deleteCourseMutation = gql`
  mutation deleteCourse($termId:ID!,$courseId:ID!){
    deleteCourse(termId: $termId,courseId: $courseId){
      id
      teacherNames
      courseName
      courseLocation
      courseType
      courseWeeks
      classTimes{
        dayOfWeek
        start
        end
      }
      studentCount
      color
    }
  }
`;

export const uploadAcademicTermMutation = gql`
  mutation uploadAcademicTerm($file:Upload!){
    uploadAcademicTerm(file: $file){
      termName
      courses{
        teacherNames
        courseName
        courseLocation
        courseType
        courseWeeks
        classTimes{
          dayOfWeek
          start
          end
        }
        studentCount
        color
      }
    }
  }
`;
