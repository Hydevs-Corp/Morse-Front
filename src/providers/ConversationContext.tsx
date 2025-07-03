import { createContext } from 'react';
import type {
    Conversation,
    Message,
    OnlineListItem,
} from '../scripts/types/types';

const defaultValue = {
    history: {},
    currentConversationId: null,
    setCurrentConversationId: () => {},
    setConversationName: () => {},
    handleSendMessage: () => {},
    handleReceiveMessage: () => {},
    handleUpdateMessage: () => {},
    handleDeleteMessage: () => {},
    isOnline: () => false,
    onlineList: [],
};

type ConversationContextType = {
    history: Record<string, Conversation>;
    currentConversationId: string | null;
    setCurrentConversationId: (id: string | null) => void;
    setConversationName: (conversationId: string, newName: string) => void;
    handleSendMessage: (message: string) => void;
    handleReceiveMessage: (message: Message) => void;
    handleUpdateMessage: (messageId: string, newContent: string) => void;
    handleDeleteMessage: (messageId: string) => void;
    isOnline: (id: string) => boolean;
    onlineList: OnlineListItem[];
};

export const ConversationContext =
    createContext<ConversationContextType>(defaultValue);
