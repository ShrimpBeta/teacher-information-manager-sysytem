import { gql } from "@apollo/client";

export const monographQuery = gql`
  query monographQuery($id: ID!) {
    monograph(id: $id) {
      id
      teachersIn {
        id
        username
        email
        avatar
        createdAt
      }
      teachersOut
      title
      publishDate
      publishLevel
      rank
      createdAt
      updatedAt
    }
  }
`;

export const monographsByFilterQuery = gql`
  query monographsByFilter($filter: MonographFilter!, $offset: Int!, $limit: Int!) {
    monographsByFilter(filter: $filter, offset: $offset, limit: $limit) {
      totalCount
      monographs{
        id
        teachersIn{
          id
          username
          email
          avatar
          createdAt
        }
        teachersOut
        title
        publishDate
        publishLevel
        rank
        createdAt
        updatedAt
      }
    }
  }
`;
