import { gql } from "@apollo/client";

export const eduReformQuery = gql`
  query eduReformQuery($id: ID!) {
    eduReform(id: $id) {
      id
      teachersIn{
        id
        username
        email
        avatar
        createdAt
      }
      teachersOut
      number
      title
      startDate
      duration
      level
      rank
      achievement
      fund
      createdAt
      updatedAt
    }
  }
`;

export const eduReformsByFilterQuery = gql`
  query eduReformsByFilter($filter: EduReformFilter!,$offset:Int!, $limit:Int!) {
    eduReformsByFilter(filter: $filter, offset: $offset, limit: $limit) {
      totalCount
      eduReforms{
        id
        teachersIn{
          id
          username
          email
          avatar
          createdAt
        }
        teachersOut
        number
        title
        startDate
        duration
        level
        rank
        achievement
        fund
        createdAt
        updatedAt
      }
    }
  }
`;
