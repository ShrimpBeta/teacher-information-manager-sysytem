import { gql } from "apollo-angular";

export const papersByFilterQuery = gql`
  query papersByFilter($filter: PaperFilter!) {
    papersByFilter(filter: $filter) {
      id
      teachersIn{
        id
        username
        email
        avatar
      }
      teachersOut
      title
      publishDate
      rank
      journalName
      journalLevel
      createdAt
      updatedAt
    }
  }
`;

export const paperQuery = gql`
  query paper($id: ID!) {
    paper(id:$id) {
      id
      teachersIn{
        id
        username
        email
        avatar
      }
      teachersOut
      title
      publishDate
      rank
      journalName
      journalLevel
      createdAt
      updatedAt
    }
  }
`;
