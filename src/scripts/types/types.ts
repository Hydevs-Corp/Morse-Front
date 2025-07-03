export type User = {
    id: string;
    email: string;
    name: string;
    avatar?: string;
};

export type Message = {
    content: string;
    id: string;
    conversationId: string;
    user: User;
    createdAt?: string;
    updatedAt?: string;
};

export type Conversation = {
    conversationId: string;
    participants: User[];
    messages: Message[];
    name?: string;
    lastMessageDate?: number;
    createdAt?: string;
    updatedAt?: string;
};

export type AuthModel = User & {
    token?: string;
};

export type AuthPayload = {
    token: string;
    user: User;
};

export interface OnlineListItem {
    socketId: string[];
    userId: string;
    lastConnection?: Date;
}

export type GetUsersResponse = {
    users: User[];
};

export type GetConversationResponse = {
    conversation: Conversation;
};

export type GetMyConversationsResponse = {
    getMyConversations: Conversation[];
};

export type SendMessageResponse = {
    sendMessage: Message;
};

export type UpdateMessageResponse = {
    updateMessage: Message;
};

export type DeleteMessageResponse = {
    deleteMessage: boolean;
};

export type SigninResponse = {
    signin: string;
};

export type SignupResponse = {
    signup: AuthPayload;
};

export type GetMeResponse = {
    me: User;
};

export interface Settings {
    language: string;
    soundEnabled: boolean;
    volume: number;
    morsePercent: number;
}

export type GetConversationsByParticipantResponse = {
    conversationsByParticipant: { id: string }[];
};

export interface JWTDecoded {
    sub: number;
    email: string;
    iat: number;
    avatar: string;
}

export interface MessageProps {
    message: Message;
    isCurrentUser: boolean;
    lastUserId?: string | null;
}

export type conversationName = {
    conversationName: string;
};
