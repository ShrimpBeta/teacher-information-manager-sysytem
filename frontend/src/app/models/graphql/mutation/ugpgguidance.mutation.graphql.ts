import { gql } from "apollo-angular";

export const createUGPGGuidanceMutation = gql`
  mutation createUGPGGuidance($uGPGGuidanceData: UGPGGuidanceData!) {
    createUGPGGuidance(uGPGGuidanceData: $uGPGGuidanceData) {
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

export const updateUGPGGuidanceMutation = gql`
  mutation updateUGPGGidance($id:ID!,$uGPGGuidanceData: UGPGGuidanceData!){
    updateUGPGGuidance(id: $id, uGPGGuidanceData: $uGPGGuidanceData){
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

export const deleteUGPGGuidanceMutation = gql`
  mutation deleteUGPGGuidance($id: ID!) {
    deleteUGPGGuidance(id: $id) {
      id
    }
  }
`;

export const uploadUGPGGuidancesMutation = gql`
  mutation uploadUGPGGuidances($file: Upload!) {
    uploadUGPGGuidances(file: $file) {
      studentName
      thesisTopic
      openingCheckDate
      openingCheckResult
      midtermCheckDate
      midtermCheckResult
      defenseDate
      defenseResult
    }
  }
`;
