import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { Flex } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import MorseText from '../components/morse/MorseText';
import { GetConversationById } from '../graphql/query/getConversation';
import { GetMyConversation } from '../graphql/query/getMyConversations';
import { GET_ONLINE_USERS } from '../graphql/query/getOnlineUsers';
import {
    SEND_MESSAGE,
    UPDATE_MESSAGE,
    DELETE_MESSAGE,
} from '../graphql/mutation/messages';
import { SET_USER_ONLINE, SET_USER_OFFLINE } from '../graphql/mutation/users';
import {
    MESSAGE_ADDED_SUBSCRIPTION,
    MESSAGE_UPDATED_SUBSCRIPTION,
    MESSAGE_DELETED_SUBSCRIPTION,
    ONLINE_USERS_SUBSCRIPTION,
} from '../graphql/subscription/subscriptions';
import type {
    Conversation,
    Message,
    OnlineListItem,
    User,
} from '../scripts/types/types';
import { ConversationContext } from './ConversationContext';
import { useAuth } from './useAuth';

const removeArrayDuplicates = <T extends { id: string }>(array: T[]): T[] => {
    const uniqueIds = new Set<string>();
    return array.filter(item => {
        if (uniqueIds.has(item.id)) {
            return false;
        }
        uniqueIds.add(item.id);
        return true;
    });
};

const ConversationProvider = ({ children }: { children: ReactNode }) => {
    const { authStore } = useAuth();
    const [history, setHistory] = useState<Record<string, Conversation>>({});
    const [onlineList, setOnlineList] = useState<OnlineListItem[]>([]);
    const [currentConversationId, _setCurrentConversationId] = useState<
        string | null
    >(null);

    const [sendMessage] = useMutation(SEND_MESSAGE);
    const [updateMessage] = useMutation(UPDATE_MESSAGE);
    const [deleteMessage] = useMutation(DELETE_MESSAGE);
    const [setUserOnline] = useMutation(SET_USER_ONLINE);
    const [setUserOffline] = useMutation(SET_USER_OFFLINE);

    useEffect(() => {
        if (!authStore.id) {
            setHistory({});
        }
    }, [authStore.id]);

    const { refetch } = useQuery(GetConversationById, {
        variables: {
            conversationId: parseInt(currentConversationId || '0'),
        },
        onCompleted: data => {
            if (data.conversation) {
                const conversation = data.conversation;
                setHistory(prevHistory => ({
                    ...prevHistory,
                    [conversation.id]: {
                        ...data.conversation,
                        lastMessageDate: conversation.lastMessageDate
                            ? new Date(conversation.lastMessageDate).getTime()
                            : undefined,
                        messages: removeArrayDuplicates([
                            ...(prevHistory[conversation.id]?.messages || []),
                            ...conversation.messages,
                        ]),
                    },
                }));
            }
        },
        onError: error => {
            console.error('Error fetching conversation:', error);
        },
    });

    useQuery(GET_ONLINE_USERS, {
        onCompleted: data => {
            if (data.getOnlineUsers?.online) {
                const onlineUsers = data.getOnlineUsers.online.map(
                    (user: { userId: string; lastConnection: string }) => ({
                        userId: user.userId,
                        lastConnection: new Date(user.lastConnection),
                        socketId: [],
                    })
                );
                setOnlineList(onlineUsers);
            }
        },
        onError: error => {
            console.error('Error fetching online users:', error);
        },
        skip: !authStore.id,
        fetchPolicy: 'cache-and-network',
    });

    useQuery(GetMyConversation, {
        onCompleted: data => {
            if (data.getMyConversations) {
                const conversations = data.getMyConversations;
                const conversationHistory: Record<string, Conversation> = {};

                conversations.forEach(
                    (conversation: {
                        id: string;
                        name?: string;
                        participants: User[];
                        messages: Message[];
                        lastMessageDate?: string;
                        createdAt?: string;
                        updatedAt?: string;
                    }) => {
                        conversationHistory[conversation.id] = {
                            conversationId: conversation.id,
                            name: conversation.name,
                            participants: conversation.participants,
                            messages: conversation.messages || [],
                            lastMessageDate: conversation.lastMessageDate
                                ? new Date(
                                      conversation.lastMessageDate
                                  ).getTime()
                                : undefined,
                            createdAt: conversation.createdAt,
                            updatedAt: conversation.updatedAt,
                        };
                    }
                );

                setHistory(conversationHistory);
            }
        },
        onError: error => {
            console.error('Error fetching conversations:', error);
        },
        // skip: !authStore.id,
        fetchPolicy: 'network-only',
    });

    useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
        variables: { userId: parseInt(authStore.id || '0') },
        onData: ({ data }) => {
            if (data.data?.messageAdded) {
                const message = data.data.messageAdded;
                const messageData: Message = {
                    id: message.id,
                    content: message.content,
                    conversationId:
                        message.conversationId?.toString() ||
                        message.conversation?.id?.toString(),
                    user: {
                        id: message.user.id.toString(),
                        name: message.user.name || message.user.email,
                        email: message.user.email,
                    },
                };
                handleReceiveMessage(messageData);
            }
        },
        skip: !authStore.id,
    });

    useSubscription(MESSAGE_UPDATED_SUBSCRIPTION, {
        variables: { userId: parseInt(authStore.id || '0') },
        onData: ({ data }) => {
            if (data.data?.messageUpdated) {
                handleMessageUpdated(data.data.messageUpdated);
            }
        },
        skip: !authStore.id,
    });

    useSubscription(MESSAGE_DELETED_SUBSCRIPTION, {
        variables: { userId: parseInt(authStore.id || '0') },
        onData: ({ data }) => {
            if (data.data?.messageDeleted) {
                handleMessageDeleted(data.data.messageDeleted);
            }
        },
        skip: !authStore.id,
    });

    useSubscription(ONLINE_USERS_SUBSCRIPTION, {
        onData: ({ data }) => {
            if (data.data?.onlineUsersUpdated) {
                const onlineUsers = data.data.onlineUsersUpdated.online.map(
                    (user: { userId: string; lastConnection: string }) => ({
                        userId: user.userId,
                        lastConnection: new Date(user.lastConnection),
                        socketId: [],
                    })
                );
                setOnlineList(onlineUsers);
            }
        },
        onError: error => {
            console.error('Error in online users subscription:', error);
        },
        skip: !authStore.id,
    });

    const handleSendMessage = async (message: string) => {
        try {
            await sendMessage({
                variables: {
                    content: message,
                    conversationId: parseInt(currentConversationId || '0'),
                },
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const setCurrentConversationId = useCallback(
        (id: string | null) => {
            _setCurrentConversationId(id);
            console.log('Setting current conversation ID:', id);
            if (id && !history[id]) {
                setHistory(prevHistory => ({
                    ...prevHistory,
                    [id]: {
                        conversationId: id,
                        messages: [],
                        participants: [],
                        lastMessageDate: undefined,
                    },
                }));
                refetch({
                    conversationId: parseInt(id || '0'),
                });
            }
        },
        [history, refetch]
    );

    const n = useNavigate();

    const handleReceiveMessage = useCallback(
        (message: Message) => {
            const messageData = {
                ...message,
                user: {
                    id: message.user.id.toString(),
                    name: message.user.name || message.user.email,
                    email: message.user.email,
                },
            };

            if (
                parseInt(currentConversationId ?? '0') !==
                parseInt(messageData.conversationId)
            ) {
                notifications.show({
                    id: `message-${messageData.id}`,
                    title: messageData.user.name || messageData.user.email,
                    message: (
                        <Flex justify={'space-between'}>
                            <MorseText>{messageData.content}</MorseText>
                        </Flex>
                    ),
                    autoClose: 5000,
                    onClick: () => {
                        n(`/${messageData.conversationId}`);
                        notifications.hide(`message-${messageData.id}`);
                    },
                });
            }

            setHistory(prevHistory => {
                const newHistory = { ...prevHistory };
                if (!newHistory[messageData.conversationId]) {
                    newHistory[messageData.conversationId] = {
                        conversationId: messageData.conversationId,
                        messages: [],
                        participants: [],
                        lastMessageDate: undefined,
                    };
                }

                newHistory[messageData.conversationId] = {
                    ...newHistory[messageData.conversationId],
                    lastMessageDate: new Date().getTime(),
                    messages: [
                        ...newHistory[messageData.conversationId].messages,
                        messageData,
                    ],
                };

                return newHistory;
            });
        },
        [currentConversationId, n]
    );

    const handleUpdateMessage = async (
        messageId: string,
        newContent: string
    ) => {
        try {
            await updateMessage({
                variables: {
                    messageId: parseInt(messageId),
                    content: newContent,
                },
            });
        } catch (error) {
            console.error('Error updating message:', error);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessage({
                variables: {
                    messageId: parseInt(messageId),
                },
            });
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const handleMessageUpdated = (updatedMessage: {
        content: string;
        conversationId: string;
        id: string;
    }) => {
        setHistory(prevHistory => {
            const newHistory = { ...prevHistory };
            if (newHistory[updatedMessage.conversationId]) {
                newHistory[updatedMessage.conversationId] = {
                    ...newHistory[updatedMessage.conversationId],
                    messages: newHistory[
                        updatedMessage.conversationId
                    ].messages.map(message =>
                        parseInt(message.id) === parseInt(updatedMessage.id)
                            ? { ...message, content: updatedMessage.content }
                            : message
                    ),
                };
            }
            return newHistory;
        });
    };

    const handleMessageDeleted = (data: {
        messageId: number;
        conversationId: string;
    }) => {
        setHistory(prevHistory => {
            const newHistory = { ...prevHistory };

            newHistory[data.conversationId] = {
                ...newHistory[data.conversationId],
                messages: newHistory[data.conversationId].messages.filter(
                    message => parseInt(message.id) !== data.messageId
                ),
            };

            return newHistory;
        });
    };

    const isOnline = (id: string) => {
        const isOnline = !!onlineList?.find(el => el.userId === id);
        return isOnline;
    };

    const setConversationName = useCallback(
        (conversationId: string, newName: string) => {
            setHistory(prevHistory => {
                const newHistory = { ...prevHistory };
                if (newHistory[conversationId]) {
                    newHistory[conversationId].name = newName;
                }
                return newHistory;
            });
        },
        []
    );

    useEffect(() => {
        if (authStore.id) {
            setUserOnline()
                .then(() => {
                    console.log('User set online successfully');
                    // Force a small delay to ensure the mutation is processed
                    setTimeout(() => {
                        // The subscription should automatically pick up the change
                    }, 100);
                })
                .catch(error => {
                    console.error('Error setting user online:', error);
                });
        } else {
            // Clear online list when user logs out
            setOnlineList([]);
        }

        return () => {
            if (authStore.id) {
                setUserOffline().catch(error => {
                    console.error('Error setting user offline:', error);
                });
            }
        };
    }, [authStore.id, setUserOnline, setUserOffline]);

    return (
        <ConversationContext.Provider
            value={{
                history,
                setCurrentConversationId,
                setConversationName,
                currentConversationId,
                handleSendMessage,
                handleReceiveMessage,
                handleUpdateMessage,
                handleDeleteMessage,
                isOnline,
                onlineList,
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};

export default ConversationProvider;
