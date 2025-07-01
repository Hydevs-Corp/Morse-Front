import { useContext } from 'react';
import { ConversationContext } from '../../providers/ConversationContext';

export const useConversation = () => {
    const context = useContext(ConversationContext);
    if (context === undefined) {
        throw new Error(
            'useConversation must be used within a ConversationProvider'
        );
    }
    return context;
};
