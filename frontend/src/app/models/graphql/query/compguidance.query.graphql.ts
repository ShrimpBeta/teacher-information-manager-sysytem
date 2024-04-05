import { gql } from "apollo-angular";

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
  query compGuidancesByFilter($filter: CompGuidanceFilter!) {
    compGuidancesByFilter(filter: $filter){
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
