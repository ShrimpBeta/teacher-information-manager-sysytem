import { gql } from "apollo-angular";

export const signInMutation = gql`
  mutation signIn($signInData: SigIn!){
    signIn(signInData:$signInData) {
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
`;

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
`;

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
`;

export const updateUserPasswordMutation = gql`
  mutation updateUserPassword($userId: ID!, $passwordData: UpdatePassword!){
    updateAccountPassword(userId: $userId, updatePasswordData:$passwordData)
  }
`;

export const fetchCodeMutation = gql`
  mutation fetchCode($email:String!){
    generateResetPasswordCode(email:$email)
  }
`;

export const resetUserPasswordMutation = gql`
  mutation resetUserPassword($resetPasswordData: ResetPassword!){
    resetAccountPassword(resetPasswordData: $resetPasswordData)
  }
`;


export const removeWechatAuthMutation = gql`
  mutation removeWechatAuth($userId: ID!){
    removeWechatAuth(userId: $userId)
  }
`;

