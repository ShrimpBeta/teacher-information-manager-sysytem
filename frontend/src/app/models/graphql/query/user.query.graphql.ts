import { gql } from "apollo-angular"

export const userQuery = gql`
  query user($id:ID!){
    user(id:$id){
      id
      username
      email
      avatar
      phoneNumber
      wechatAuth
      createdAt
      updatedAt
    }
  }
`

export const userExportsQuery = gql`
    query userExports{
        userExports{
            id
            username
            email
            avatar
            createdAt
        }
    }
`
