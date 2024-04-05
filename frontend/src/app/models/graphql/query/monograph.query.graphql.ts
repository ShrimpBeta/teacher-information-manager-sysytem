import { gql } from "apollo-angular";

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
  query monographsByFilter($filter: MonographFilter!) {
    monographsByFilter(filter: $filter){
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
`;
