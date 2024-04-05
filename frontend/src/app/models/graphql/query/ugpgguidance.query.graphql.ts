import { gql } from "apollo-angular";

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
  query uGPGGuidancesByFilter($filter: UGPGGuidanceFilter!) {
    uGPGGuidancesByFilter(filter: $filter){
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
