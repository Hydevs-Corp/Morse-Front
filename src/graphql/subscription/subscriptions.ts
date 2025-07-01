import { gql } from '@apollo/client';

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
    subscription MessageAdded($userId: Int!) {
        messageAdded(userId: $userId) {
            id
            content
            createdAt
            updatedAt
            user {
                id
                name
                email
            }
            conversation {
                id
            }
        }
    }
`;

export const MESSAGE_UPDATED_SUBSCRIPTION = gql`
    subscription MessageUpdated($userId: Int!) {
        messageUpdated(userId: $userId) {
            id
            content
            conversationId
        }
    }
`;

export const MESSAGE_DELETED_SUBSCRIPTION = gql`
    subscription MessageDeleted($userId: Int!) {
        messageDeleted(userId: $userId) {
            messageId
            conversationId
        }
    }
`;

export const ONLINE_USERS_SUBSCRIPTION = gql`
    subscription OnlineUsersUpdated {
        onlineUsersUpdated {
            online {
                userId
                lastConnection
            }
        }
    }
`;
