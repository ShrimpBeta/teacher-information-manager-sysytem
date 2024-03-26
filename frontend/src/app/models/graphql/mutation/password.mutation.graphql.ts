import { gql } from "apollo-angular";

export const createPasswordMutation = gql`
  mutation createPassword($userId: ID!, $passwordData: NewPassword!) {
    createPassword(userId: $userId, newPasswordData: $passwordData) {
      id
      url
      appName
      password
      description
      updatedAt
      createdAt
    }
  }
`

export const updatePasswordMutation = gql`
  mutation updatePassword($id: ID!, $passwordData: UpdatePassword!) {
    updatePassword(id: $id, passwordData: $passwordData) {
      id
      url
      appName
      password
      description
      updatedAt
      createdAt
  }
}
`

export const deletePasswordMutation = gql`
  mutation deletePassword($id: ID!) {
    deletePassword(id: $id){
      id
      url
      appName
      password
      description
      updatedAt
      createdAt
    }
  }
`
