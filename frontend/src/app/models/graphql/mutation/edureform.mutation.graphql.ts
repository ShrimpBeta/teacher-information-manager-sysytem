import { gql } from "apollo-angular";

export const createEduReformMutation = gql`
  mutation createEduReform($eduReformData: EduReformData!) {
    createEduReform(eduReformData: $eduReformData) {
      id
      # teachersIn{
      #   id
      #   username
      #   email
      #   avatar
      #   createdAt
      # }
      # teachersOut
      # title
      # number
      # startDate
      # duration
      # level
      # rank
      # achievement
      # fund
      # createdAt
      # updatedAt
    }
  }
`;

export const updateEduReformMutation = gql`
  mutation updateEduReform($id:ID!,$eduReformData: EduReformData!) {
    updateEduReform(id: $id,eduReformData: $eduReformData) {
      id
      # teachersIn{
      #   id
      #   username
      #   email
      #   avatar
      #   createdAt
      # }
      # teachersOut
      # title
      # number
      # startDate
      # duration
      # level
      # rank
      # achievement
      # fund
      # createdAt
      # updatedAt
    }
  }
`;

export const deleteEduReformMutation = gql`
  mutation deleteEduReform($id:ID!) {
    deleteEduReform(id: $id) {
      id
      # teachersIn{
      #   id
      #   username
      #   email
      #   avatar
      #   createdAt
      # }
      # teachersOut
      # title
      # number
      # startDate
      # duration
      # level
      # rank
      # achievement
      # fund
      # createdAt
      # updatedAt
    }
  }
`;

export const uploadEduReformsMutation = gql`
  mutation uploadEduReforms($file: Upload!) {
    uploadEduReforms(file: $file) {
      teachersIn{
        id
        username
        email
        avatar
        createdAt
      }
      number
      teachersOut
      title
      startDate
      duration
      level
      rank
      achievement
      fund
    }
  }
`;



