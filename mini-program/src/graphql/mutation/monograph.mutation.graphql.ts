import { gql } from "@apollo/client";

export const createMonographMutation = gql`
  mutation createMonograph($monographData: MonographData!) {
    createMonograph(monographData: $monographData) {
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

export const updateMonographMutation = gql`
  mutation updateMonograph($id:ID!,$monographData: MonographData!) {
    updateMonograph(id: $id,monographData: $monographData) {
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

export const deleteMonographMutation = gql`
  mutation deleteMonograph($id:ID!) {
    deleteMonograph(id: $id) {
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

export const uploadMonographsMutation = gql`
  mutation uploadMonographs($file: Upload!) {
    uploadMonographs(file: $file) {
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
    }

  }
`;

