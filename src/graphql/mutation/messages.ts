import { gql } from '@apollo/client';
import { MESSAGE_FRAGMENT } from '../fragments/fragments';

export const SEND_MESSAGE = gql`
    mutation SendMessage($conversationId: Int!, $content: String!) {
        sendMessage(conversationId: $conversationId, content: $content) {
            ...MessageFragment
            conversation {
                id
            }
        }
    }
    ${MESSAGE_FRAGMENT}
`;

export const UPDATE_MESSAGE = gql`
    mutation UpdateMessage($messageId: Int!, $content: String!) {
        updateMessage(messageId: $messageId, content: $content) {
            id
            content
            updatedAt
        }
    }
`;

export const DELETE_MESSAGE = gql`
    mutation DeleteMessage($messageId: Int!) {
        deleteMessage(messageId: $messageId)
    }
`;
