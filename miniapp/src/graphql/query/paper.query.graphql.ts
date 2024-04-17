import { gql } from "@apollo/client";

export const papersByFilterQuery = gql`
  query papersByFilter($filter: PaperFilter!,$offset: Int!,$limit: Int!) {
    papersByFilter(filter: $filter,offset: $offset,limit: $limit) {
      totalCount
      papers{
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
