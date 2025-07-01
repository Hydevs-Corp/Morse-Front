import { gql } from '@apollo/client';
import { CONVERSATION_FRAGMENT } from '../fragments/fragments';

export const GetMyConversation = gql`
    query {
        getMyConversations {
            ...ConversationFragment
        }
    }
    ${CONVERSATION_FRAGMENT}
`;
