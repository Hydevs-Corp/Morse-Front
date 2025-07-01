export type Conversation = {
    conversationId: string;
    participants: User[];
    messages: Message[];
    lastMessageDate?: number;
};

export type Message = {
    content: string;
    id: string;
    conversationId: string;
    user: User;
};

export type User = {
    id: string;
    email: string;
    name: string;
};

export type AuthModel = User & {
    token?: string;
};

export interface onlineListItem {
    socketId: string[];
    userId: string;
    lastConnection?: Date;
}
