import { gql } from "@apollo/client";

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
  query mentorshipsByFilter($filter: MentorshipFilter!, $offset: Int!, $limit: Int!) {
    mentorshipsByFilter(filter: $filter, offset: $offset, limit: $limit) {
      totalCount
      mentorships{
        id
        projectName
        studentNames
        grade
        guidanceDate
        createdAt
        updatedAt
      }
    }
  }
`;
