import { gql } from "apollo-angular";

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
            wechatToken
            createdAt
            updatedAt
        }
    }
`

