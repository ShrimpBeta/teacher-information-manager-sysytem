import { gql } from "@apollo/client";

export const passwordsQuery = gql`
  query passwords($userId: ID!) {
    passwords(userId: $userId) {
      id
      url
      appName
      account
      password
      description
      updatedAt
      createdAt
    }
  }
`

export const passwordQuery = gql`
  query password($id: ID!) {
    password(id: $id) {
      id
      url
      appName
      account
      password
      description
      updatedAt
      createdAt
    }
  }
`
