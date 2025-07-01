import { ActionIcon, Card, Flex, Menu, Text, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import {
    IconCheck,
    IconCopy,
    IconEdit,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import { useState } from 'react';
import type { MessageProps } from '../scripts/types/types';
import { useConversation } from './conversations/useConversation';
import MorseText from './morse/MorseText';

const Message = ({ message, isCurrentUser, lastUserId }: MessageProps) => {
    const { handleUpdateMessage, handleDeleteMessage } = useConversation();
    const handleCopyMessage = () => {
        navigator.clipboard.writeText(message.content);
    };
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message.content);

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.shiftKey) {
            handleDeleteMessage(message.id);
            return;
        }
        modals.openConfirmModal({
            title: 'Delete Message',
            children: (
                <Text size="sm">
                    Are you sure you want to delete this message?
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => handleDeleteMessage(message.id),
            onCancel: () => setIsEditMode(false),
        });
    };

    if (isEditMode) {
        return (
            <Flex justify={!isCurrentUser ? 'flex-start' : 'flex-end'}>
                <Card
                    p={'xs'}
                    w={'fit-content'}
                    maw={'100%'}
                    withBorder
                    shadow="sm"
                    bg={isCurrentUser ? 'gray.5' : 'dark'}
                >
                    <TextInput
                        value={editedMessage}
                        onChange={e => setEditedMessage(e.target.value)}
                        autoFocus
                        placeholder="Edit your message"
                        style={{
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                        }}
                    />
                    <Flex mt={4} gap={4} justify={'flex-end'}>
                        <ActionIcon
                            onClick={() => {
                                setIsEditMode(false);
                                setEditedMessage(message.content);
                            }}
                        >
                            <IconX />
                        </ActionIcon>
                        <ActionIcon>
                            <IconCheck
                                onClick={() => {
                                    handleUpdateMessage(
                                        message.id,
                                        editedMessage
                                    );
                                    setIsEditMode(false);
                                }}
                            />
                        </ActionIcon>
                    </Flex>
                </Card>
            </Flex>
        );
    }

    return (
        <Flex justify={!isCurrentUser ? 'flex-start' : 'flex-end'}>
            <Menu
                disabled={!isCurrentUser}
                withArrow
                shadow="md"
                position="left"
            >
                <Menu.Target>
                    <Flex
                        maw={'70%'}
                        direction={'column'}
                        align={!isCurrentUser ? 'flex-start' : 'flex-end'}
                    >
                        {lastUserId === message.user.id && (
                            <MorseText size="xs" c="gray">
                                {message.user.name || message.user.email}
                            </MorseText>
                        )}
                        <Card
                            p={'xs'}
                            w={'fit-content'}
                            maw={'100%'}
                            withBorder
                            shadow="sm"
                            bg={isCurrentUser ? 'gray.5' : 'dark'}
                        >
                            <MorseText
                                style={{
                                    wordBreak: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {message.content}
                            </MorseText>
                        </Card>
                    </Flex>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item
                        leftSection={<IconCopy />}
                        onClick={handleCopyMessage}
                    >
                        <MorseText>Copy</MorseText>
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<IconEdit />}
                        onClick={() => {
                            setIsEditMode(true);
                            setEditedMessage(message.content);
                        }}
                    >
                        <MorseText>Edit</MorseText>
                    </Menu.Item>
                    <Menu.Item
                        color="red"
                        leftSection={<IconTrash />}
                        onClick={handleDeleteClick}
                    >
                        <MorseText>Delete</MorseText>
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Flex>
    );
};

export default Message;
