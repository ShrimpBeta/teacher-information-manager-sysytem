import { gql } from "apollo-angular";

export const passwordsQuery = gql`
  query passwords($userId: ID!) {
    passwords(userId: $userId) {
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

export const passwordQuery = gql`
  query password($Id: ID!) {
    password(id: $Id) {
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
