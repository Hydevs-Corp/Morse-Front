import { gql } from '@apollo/client';
import { CONVERSATION_FRAGMENT } from '../fragments/fragments';

export const GetConversationById = gql`
    query GetConversationById($conversationId: Int!) {
        conversation(id: $conversationId) {
            ...ConversationFragment
        }
    }
    ${CONVERSATION_FRAGMENT}
`;
