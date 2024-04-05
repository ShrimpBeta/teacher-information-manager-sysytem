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
  query academicTermsQuery($userId:ID!) {
    academicTerms(userId:$userId){
      id
      termName
      createdAt
      updatedAt
    }
  }
`;
