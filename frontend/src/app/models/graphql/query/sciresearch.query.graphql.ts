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

export const sciResearchsByFilterQuery = gql`
  query sciResearchsByFilter($filter: SciResearchFilter!, $offset: Int!, $limit: Int!) {
    sciResearchsByFilter(filter: $filter, offset: $offset, limit: $limit) {
      totalCount
      sciResearchs{
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
          awardName
          awardDate
          awardLevel
          awardRank
        }
        createdAt
        updatedAt
      }
    }
  }
`;
