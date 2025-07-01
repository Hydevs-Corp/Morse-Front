import { gql } from '@apollo/client';

export const GetMyConversation = gql`
    query {
        getMyConversations {
            id
            participants {
                id
                email
                name
            }
            messages {
                id
                content
                user {
                    id
                    name
                }
            }
            createdAt
            updatedAt
        }
    }
`;
