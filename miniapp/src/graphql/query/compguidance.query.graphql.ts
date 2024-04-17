import { gql } from "@apollo/client";

export const compGuidanceQuery = gql`
  query compGuidanceQuery($id: ID!) {
    compGuidance(id: $id){
      id
      projectName
      studentNames
      competitionScore
      guidanceDate
      awardStatus
      createdAt
      updatedAt
    }
  }
`;

export const compGuidancesByFilterQuery = gql`
  query compGuidancesByFilter($filter: CompGuidanceFilter!,$offset:Int!,$limit:Int!) {
    compGuidancesByFilter(filter: $filter, offset: $offset, limit: $limit) {
      totalCount
      compGuidances{
        id
        projectName
        studentNames
        competitionScore
        guidanceDate
        awardStatus
        createdAt
        updatedAt
      }
    }
  }
`;
