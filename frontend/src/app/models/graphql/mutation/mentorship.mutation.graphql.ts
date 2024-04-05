import { gql } from "apollo-angular";

export const createMentorshipMutation = gql`
  mutation createMentorship($userId:ID!,$mentorshipData: MentorshipData!) {
    createMentorship(userId: $userId,mentorshipData: $mentorshipData) {
      id
      projectName
      studentNames
      grade
      guidanceDate
      createdAt
      updatedAt
    }
  }
`;

export const updateMentorshipMutation = gql`
  mutation updateMentorship($id:ID!,$mentorshipData: MentorshipData!) {
    updateMentorship(id: $id,mentorshipData: $mentorshipData) {
      id
      projectName
      studentNames
      grade
      guidanceDate
      createdAt
      updatedAt
    }
  }
`;

export const deleteMentorshipMutation = gql`
  mutation deleteMentorship($id:ID!) {
    deleteMentorship(id: $id) {
      id
      projectName
      studentNames
      grade
      guidanceDate
      createdAt
      updatedAt
    }
  }
`;

export const uploadMentorshipsMutation = gql`
  mutation uploadMentorships($file: Upload!) {
    uploadMentorships(file: $file) {
      projectName
      studentNames
      grade
      guidanceDate
    }
  }
`;

export const createMentorshipsMutation = gql`
  mutation createMentorships($userId:ID!,$mentorshipsData: [MentorshipData]!) {
    createMentorships(userId: $userId,mentorshipsData: $mentorshipsData) {
      id
      projectName
      studentNames
      grade
      guidanceDate
      createdAt
      updatedAt
    }
  }
`;
