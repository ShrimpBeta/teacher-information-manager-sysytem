import { gql } from "apollo-angular";

export const papersQuery = gql`
  query papers($userId: ID!) {
    papers(userId: $userId) {
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
