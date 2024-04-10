import { gql } from "apollo-angular";

export const createSciResearchMutation = gql`
  mutation createSciResearch($sciResearchData: SciResearchData!) {
    createSciResearch(sciResearchData: $sciResearchData) {
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
      isAward
      awards{
        id
        awardName
        awardDate
        awardLevel
        awardRank
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateSciResearchMutation = gql`
  mutation updateSciResearch($id:ID!,$sciResearchData: SciResearchData!) {
    updateSciResearch(id: $id,sciResearchData: $sciResearchData) {
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
      isAward
      awards{
        id
        awardName
        awardDate
        awardLevel
        awardRank
      }
      createdAt
      updatedAt
    }
  }
`;

export const deleteSciResearchMutation = gql`
  mutation deleteSciResearch($id:ID!) {
    deleteSciResearch(id: $id){
      id
    }
  }
`;

export const uploadSciResearchsMutation = gql`
  mutation uploadSciResearchs($file: Upload!) {
    uploadSciResearchs(file: $file) {
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
      isAward
      awards{
        awardName
        awardDate
        awardLevel
        awardRank
      }
    }
  }
`;

