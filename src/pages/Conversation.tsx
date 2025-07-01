/* eslint-disable react-hooks/exhaustive-deps */
import { ActionIcon, Box, Flex, ScrollArea, TextInput } from '@mantine/core';
import { IconSend2 } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useConversation } from '../components/conversations/useConversation';
import Message from '../components/Message';
import { useAuth } from '../providers/useAuth';
import useMorse from '../hook/useMorse';

const Conversation = () => {
    const params = useParams();
    const viewport = useRef<HTMLDivElement>(null);
    const [field, setField] = useState({
        value: '',
        error: '',
    });
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

    useEffect(() => {
        if (
            viewport.current &&
            currentConversationId &&
            history[currentConversationId]?.messages?.length > 0
        ) {
            viewport.current.scrollTo({
                top: viewport.current.scrollHeight,
                behavior: 'instant',
            });
        }
    }, [
        currentConversationId,
        currentConversationId &&
            history[currentConversationId]?.messages?.length > 0,
    ]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (field.value.trim() === '') {
            setField({ value: '', error: 'Message cannot be empty' });
            return;
        }

        handleSendMessage(field.value);

        setField({ value: '', error: '' });
    };

    const { handleRender } = useMorse();

    return (
        <>
            <Flex
                h={
                    'calc(100vh - var(--app-shell-padding) - var(--app-shell-padding))'
                }
                direction={'column'}
            >
                <ScrollArea flex={1} viewportRef={viewport}>
                    <Flex direction={'column'} gap={4} pb={'xs'} p={'md'}>
                        {currentConversationId &&
                            history[currentConversationId]?.messages?.map(
                                (message, i) => (
                                    <Message
                                        key={message.id}
                                        message={message}
                                        isCurrentUser={
                                            authStore.id === message.user.id
                                        }
                                        lastUserId={
                                            message.user.id ===
                                            (history[currentConversationId]
                                                ?.messages[i - 1]?.user.id ||
                                                null)
                                                ? null
                                                : message.user.id
                                        }
                                    />
                                )
                            )}
                    </Flex>
                </ScrollArea>
                <Box p={'xs'}>
                    <form onSubmit={onSubmit}>
                        <TextInput
                            placeholder={handleRender(
                                'Type your message here...'
                            )}
                            value={field.value}
                            onChange={e =>
                                setField({ value: e.target.value, error: '' })
                            }
                            error={field.error}
                            onKeyUp={e => {
                                if (
                                    e.key === 'Enter' &&
                                    !e.shiftKey &&
                                    field.value.trim() !== ''
                                ) {
                                    e.preventDefault();
                                    onSubmit(e);
                                }
                            }}
                            rightSection={
                                <ActionIcon type="submit">
                                    <IconSend2 />
                                </ActionIcon>
                            }
                        />
                    </form>
                </Box>
            </Flex>
        </>
    );
};

export default Conversation;
