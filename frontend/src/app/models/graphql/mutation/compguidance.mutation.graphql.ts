import { gql } from "apollo-angular";

export const createCompGuidanceMutation = gql`
  mutation createCompGuidance($compGuidanceData: CompGuidanceData!) {
    createCompGuidance(compGuidanceData: $compGuidanceData) {
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

export const updateCompGuidanceMutation = gql`
  mutation updateCompGuidance($id:ID!,$compGuidanceData: CompGuidanceData!) {
    updateCompGuidance(id: $id,compGuidanceData: $compGuidanceData) {
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

export const deleteCompGuidanceMutation = gql`
  mutation deleteCompGuidance($id:ID!) {
    deleteCompGuidance(id: $id) {
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

export const uploadCompGuidancesMutation = gql`
  mutation uploadCompGuidances($file: Upload!) {
    uploadCompGuidances(file: $file) {
      projectName
      studentNames
      competitionScore
      guidanceDate
      awardStatus
    }
  }
`;

export const createCompGuidancesMutation = gql`
  mutation createCompGuidances($compGuidancesData: [CompGuidanceData]!) {
    createCompGuidances(compGuidancesData: $compGuidancesData) {
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
