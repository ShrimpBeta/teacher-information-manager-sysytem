import { gql } from "apollo-angular";

export const sciResearchQuery = gql`
  query sciResearch($id: ID!) {
    sciResearch(id: $id){
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

export const sciResearchsByFilterQuery = gql`
  query sciResearchsByFilter($filter: SciResearchFilter!) {
    sciResearchsByFilter(filter: $filter){
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
