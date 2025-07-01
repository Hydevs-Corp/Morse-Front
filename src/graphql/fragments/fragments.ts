import { gql } from '@apollo/client';

// Fragment for User entity
export const USER_FRAGMENT = gql`
    fragment UserFragment on User {
        id
        email
        name
    }
`;

// Fragment for Message entity
export const MESSAGE_FRAGMENT = gql`
    fragment MessageFragment on Message {
        id
        content
        createdAt
        updatedAt
        user {
            ...UserFragment
        }
    }
    ${USER_FRAGMENT}
`;

// Fragment for Conversation entity
export const CONVERSATION_FRAGMENT = gql`
    fragment ConversationFragment on Conversation {
        id
        participants {
            ...UserFragment
        }
        messages {
            ...MessageFragment
        }
        lastMessageDate
        createdAt
        updatedAt
    }
    ${USER_FRAGMENT}
    ${MESSAGE_FRAGMENT}
`;

// Fragment for minimal conversation (without messages)
export const CONVERSATION_MINIMAL_FRAGMENT = gql`
    fragment ConversationMinimalFragment on Conversation {
        id
        participants {
            ...UserFragment
        }
        lastMessageDate
        createdAt
        updatedAt
    }
    ${USER_FRAGMENT}
`;
