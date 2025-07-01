import { gql } from '@apollo/client';

export const GetConversationById = gql`
    query GetConversationById($conversationId: Int!) {
        conversation(id: $conversationId) {
            id
            participants {
                email
                id
                name
            }
            messages {
                id
                content
                user {
                    email
                    id
                    name
                }
            }
            lastMessageDate
        }
    }
`;
