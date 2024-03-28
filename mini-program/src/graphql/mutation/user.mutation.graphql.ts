import { gql } from "@apollo/client";

export const signInMutation = gql`
  mutation signIn($email: String!, $password: String!){
    signIn(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        avatar
        phoneNumber
        activate
        wechatAuth
        createdAt
        updatedAt
      }
    }
  }
`

export const updateUserMutation = gql`
  mutation updateUser($userId: ID!, $userData: UpdateUser!){
    updateUser(userId: $userId, userData: $userData){
      id
      username
      email
      avatar
      phoneNumber
      activate
      wechatAuth
      createdAt
      updatedAt
    }
  }
`

export const activateUserMutation = gql`
  mutation activateUser($userId: ID!, $userData: ActivateUser!){
    activateUser(userId: $userId, userData: $userData){
      id
      username
      email
      avatar
      phoneNumber
      activate
      wechatAuth
      createdAt
      updatedAt
    }
  }
`

export const updateUserPasswordMutation = gql`
  mutation updateUserPassword($userId: ID!, $passwordData: ChangePassword!){
    updateAccountPassword(userId: $userId, passwordData:$passwordData)
  }
`

// export const removeWechatAuthMutation = gql`
//   mutation removeWechatAuth($userId: ID!){

//   }
// `

