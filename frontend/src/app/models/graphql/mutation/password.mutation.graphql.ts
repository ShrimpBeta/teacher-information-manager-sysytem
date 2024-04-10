import { gql } from "apollo-angular";

export const createPasswordMutation = gql`
  mutation createPassword($passwordData: PasswordData!) {
    createPassword(passwordData: $passwordData) {
      id
      url
      appName
      description
      updatedAt
      createdAt
    }
  }
`;

export const updatePasswordMutation = gql`
  mutation updatePassword($id: ID!, $passwordData: PasswordData!) {
    updatePassword(id: $id, passwordData: $passwordData) {
      id
      url
      appName
      description
      updatedAt
      createdAt
  }
}
`;

export const deletePasswordMutation = gql`
  mutation deletePassword($id: ID!) {
    deletePassword(id: $id){
      id
    }
  }
`;

export const uploadPasswordsMutation = gql`
  mutation uploadPasswords($file:Upload!) {
    uploadPasswords(file: $file) {
      url
      appName
      password
      description
    }
  }
`;

