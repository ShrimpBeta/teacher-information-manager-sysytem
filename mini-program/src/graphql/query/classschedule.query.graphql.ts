import { gql } from "@apollo/client";

export const academicTermQuery = gql`
  query academicTermQuery($id: ID!) {
    academicTerm(id: $id) {
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
        courseTimes{
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

export const academicTermsShortByFilterQuery = gql`
  query academicTermsQuery($filter:AcademicTermFilter!,$offset:Int!,$limit:Int!) {
    academicTermsByFilter(filter: $filter,offset: $offset, limit: $limit) {
      totalCount
      academicTerms{
        id
        termName
        startDate
        weekCount
        createdAt
        updatedAt
      }
    }
  }
`;
