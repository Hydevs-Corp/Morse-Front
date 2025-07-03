import { Flex, ScrollArea } from '@mantine/core';
import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import { useConversation } from '../components/conversations/useConversation';
import Message from '../components/Message';
import MessageInput from '../components/MessageInput';
import { useAuth } from '../providers/useAuth';

const Conversation = () => {
    const params = useParams();
    const viewport = useRef<HTMLDivElement>(null);
    const { authStore } = useAuth();

    const {
        setCurrentConversationId,
        history,
        currentConversationId,
        handleSendMessage,
    } = useConversation();
    useEffect(() => {
        if (params.id) {
            setCurrentConversationId(params.id);
        }
        return () => {
            setCurrentConversationId(null);
        };
    }, [params.id, setCurrentConversationId]);

    const currentConversation = useMemo(() => {
        if (!currentConversationId) return null;
        return history[currentConversationId];
    }, [currentConversationId, history]);

    useEffect(() => {
        if (
            viewport.current &&
            (currentConversation?.messages?.length ?? 0) > 0
        ) {
            viewport.current.scrollTo({
                top: viewport.current.scrollHeight,
                behavior: 'instant',
            });
        }
    }, [currentConversation]);

    return (
        <>
            <Flex
                h={
                    'calc(100vh - var(--app-shell-padding) - var(--app-shell-padding) - var(--app-shell-header-height))'
                }
                direction={'column'}
            >
                <ScrollArea flex={1} viewportRef={viewport}>
                    <Flex direction={'column'} gap={4} pb={'xs'} p={'md'}>
                        {currentConversation?.messages?.map((message, i) => (
                            <Message
                                key={message.id}
                                message={message}
                                isCurrentUser={authStore.id === message.user.id}
                                lastUserId={
                                    message.user.id ===
                                    (currentConversation?.messages[i - 1]?.user
                                        .id || null)
                                        ? null
                                        : message.user.id
                                }
                            />
                        ))}
                    </Flex>
                </ScrollArea>
                <MessageInput onSendMessage={handleSendMessage} />
            </Flex>
        </>
    );
};

export default Conversation;
