import { gql } from "apollo-angular";

export const createPasswordMutation = gql`
  mutation createPassword($userId: ID!, $passwordData: PasswordData!) {
    createPassword(userId: $userId, passwordData: $passwordData) {
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

export const createPasswordsMutation = gql`
  mutation createPasswords($userId: ID!, $newPasswordDatas: [PasswordData!]!) {
    createPasswords(userId: $userId, passwordsData: $newPasswordDatas) {
      id
    }
  }
`;
