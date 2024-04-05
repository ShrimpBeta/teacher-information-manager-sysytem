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
        awardlevel
        awardRank
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateSciResearchMutation = gql`
  mutation updateSciResearch($sciResearchId:ID!,$sciResearchData: SciResearchData!) {
    updateSciResearch(sciResearchId: $sciResearchId,sciResearchData: $sciResearchData) {
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
        awardlevel
        awardRank
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const deleteSciResearchMutation = gql`
  mutation deleteSciResearch($sciResearchId:ID!) {
    deleteSciResearch(sciResearchId: $sciResearchId){
      id
    }
  }
`;

export const addAwardRecordMutation = gql`
  mutation addAwardRecord($sciResearchId:ID!,$newAwardRecordData: AwardRecordData!) {
    addAwardRecord(sciResearchId: $sciResearchId,awardRecordData: $newAwardRecordData) {
      id
    }
  }
`;

export const updateAwardRecordMutation = gql`
 mutation updateAwardRecord($sciResearchId:ID!,$awardRecordId:ID!,$awardRecordData: AwardRecordData!) {
    updateAwardRecord(sciResearchId: $sciResearchId,awardRecordId: $awardRecordId,awardRecordData: $awardRecordData) {
      id
    }
  }
`;

export const deleteAwardRecordMutation = gql`
  mutation removeAwardRecord($sciResearchId:ID!,$awardRecordId:ID!) {
    removeAwardRecord(sciResearchId: $sciResearchId,awardRecordId: $awardRecordId){
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
        awardlevel
        awardRank
      }
    }
  }
`;

export const createSciResearchsMutation = gql`
  mutation createSciResearchs($newSciResearchsData: [SciResearchData]!) {
    createSciResearchs(sciResearchsData: $newSciResearchsData) {
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
        awardlevel
        awardRank
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
