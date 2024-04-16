import { gql } from "@apollo/client";

export const createPaperMutation = gql`
  mutation createPaper($paperData: PaperData!) {
    createPaper(paperData: $paperData) {
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
      rank
      journalName
      journalLevel
      createdAt
      updatedAt
    }
  }
`;

export const updatePaperMutation = gql`
  mutation updatePaper($id:ID!,$paperData: PaperData!) {
    updatePaper(id: $id,paperData: $paperData) {
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
      rank
      journalName
      journalLevel
      createdAt
      updatedAt
    }
  }
`;

export const deletePaperMutation = gql`
  mutation deletePaper($id:ID!) {
    deletePaper(id: $id) {
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
      rank
      journalName
      journalLevel
      createdAt
      updatedAt
    }
  }
`;

export const uploadPapersMutation = gql`
  mutation uploadPapers($file: Upload!) {
    uploadPapers(file: $file) {
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
      rank
      journalName
      journalLevel
    }
  }
`;
