import { gql } from '@apollo/client';

export const CREATE_CONV = gql`
    mutation CreateConversation($participantIds: [Int!]!) {
        createConversation(participantIds: $participantIds) {
            id
        }
    }
`;
