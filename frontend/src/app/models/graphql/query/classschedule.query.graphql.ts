import { gql } from "apollo-angular";

export const academicTermQuery = gql`
  query academicTermQuery($id: ID!) {
    academicTerm(id: $id) {
      id
      termName
      courses{
        id
        teacherNames
        courseName
        courseLocation
        courseType
        courseWeeks
        classTimes{
          dayOfWeek
          timeSlot
        }
        studentCount
        color
      }
      createdAt
      updatedAt
    }
  }
`;

export const academicTermsQuery = gql`
  query academicTermsQuery($offset:Int!,$limit:Int!) {
    academicTerms(offset: $offset, limit: $limit) {
      totalCount
      academicTerms{
        id
        termName
        createdAt
        updatedAt
      }
    }
  }
`;
