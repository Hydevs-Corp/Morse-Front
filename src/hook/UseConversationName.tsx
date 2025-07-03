import { useConversation } from '../components/conversations/useConversation';
import { useAuth } from '../providers/useAuth';

const useConversationName = () => {
    const { history } = useConversation();
    const { authStore } = useAuth();

    const renderConversationName = (conversationId: string | null) => {
        const currentConversation = conversationId
            ? history[conversationId]
            : null;
        if (currentConversation) {
            if (currentConversation.name) return currentConversation.name;
            const participants = currentConversation.participants || [];
            const otherParticipants = participants.filter(
                participant => authStore.email !== participant.email
            );
            const participantNames = otherParticipants
                .map(el => el.name)
                .join(', ');

            return participantNames ? participantNames : 'Conversation';
        } else {
            return 'Conversation';
        }
    };
    return renderConversationName;
};
export default useConversationName;
