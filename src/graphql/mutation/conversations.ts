import { gql } from '@apollo/client';

export const CREATE_CONV = gql`
    mutation CreateConversation($participantIds: [Int!]!) {
        createConversation(participantIds: $participantIds) {
            id
        }
    }
`;
export const UPDATE_CONV_NAME = gql`
    mutation UpdateConversationName($id: Int!, $name: String!) {
        updateConversationName(id: $id, name: $name) {
            id
            name
        }
    }
`;
