import { gql } from "apollo-angular";

export const mentorshipQuery = gql`
  query mentorshipQuery($id: ID!) {
    mentorship(id: $id) {
      id
      projectName
      studentNames
      grade
      guidanceDate
      createdAt
      updatedAt
    }
  }
`;

export const mentorshipsByFilterQuery = gql`
  query mentorshipsByFilter($filter: MentorshipFilter!) {
    mentorshipsByFilter(filter: $filter){
      id
      projectName
      studentNames
      grade
      guidanceDate
      createdAt
      updatedAt
    }
  }
`;
