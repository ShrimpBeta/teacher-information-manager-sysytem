import { gql } from "@apollo/client";

export const uGPUGGuidanceQuery = gql`
  query uGPGGuidance($id: ID!) {
    uGPGGuidance(id: $id){
      id
      studentName
      thesisTopic
      openingCheckDate
      openingCheckResult
      midtermCheckDate
      midtermCheckResult
      defenseDate
      defenseResult
      createdAt
      updatedAt
    }
  }
`;

export const uGPGGuidancesByFilterQuery = gql`
  query uGPGGuidancesByFilter($filter: UGPGGuidanceFilter!, $offset: Int!, $limit: Int!) {
    uGPGGuidancesByFilter(filter: $filter, offset: $offset, limit: $limit) {
      totalCount
      uGPGGuidances{
        id
        studentName
        thesisTopic
        openingCheckDate
        openingCheckResult
        midtermCheckDate
        midtermCheckResult
        defenseDate
        defenseResult
        createdAt
        updatedAt
      }
    }
  }
`;
