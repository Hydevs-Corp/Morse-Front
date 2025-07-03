import { gql } from '@apollo/client';

export const USER_FRAGMENT = gql`
    fragment UserFragment on User {
        id
        email
        name
        avatar
    }
`;

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

export const CONVERSATION_FRAGMENT = gql`
    fragment ConversationFragment on Conversation {
        id
        name
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
