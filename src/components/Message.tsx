import {
    ActionIcon,
    Avatar,
    Card,
    Flex,
    Menu,
    Text,
    TextInput,
} from '@mantine/core';
import { modals } from '@mantine/modals';
// @ts-expect-error - morse-code-translator is not typed
import morse from '@ozdemirburak/morse-code-translator';
import {
    IconCheck,
    IconCopy,
    IconEdit,
    IconTrash,
    IconVolume,
    IconX,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useSettings } from '../providers/useSettings';
import type { MessageProps } from '../scripts/types/types';
import { useConversation } from './conversations/useConversation';
import MorseText from './morse/MorseText';
import './Message.css';

const format = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff > oneDay) {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    } else {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }
};

const Message = ({ message, isCurrentUser, lastUserId }: MessageProps) => {
    const { handleUpdateMessage, handleDeleteMessage } = useConversation();
    const handleCopyMessage = () => {
        navigator.clipboard.writeText(message.content);
    };
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message.content);
    const { settings } = useSettings();

    const handleGenerateAudio = () => {
        if (settings.volume <= 0) return console.log('Sound is disabled');
        morse
            .audio(message.content, {
                wpm: 18,
                volume: settings.volume,
                oscillator: {
                    type: 'triangle',
                    frequency: 800,
                },
            })
            .play();
    };

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
        <Flex
            justify={!isCurrentUser ? 'flex-start' : 'flex-end'}
            className="message-container"
        >
            <Menu
                disabled={!isCurrentUser}
                withArrow
                shadow="md"
                position="left"
            >
                <Flex
                    maw={'70%'}
                    direction={'column'}
                    align={!isCurrentUser ? 'flex-start' : 'flex-end'}
                    gap={4}
                    pos={'relative'}
                >
                    <ActionIcon
                        className="message-audio-button"
                        style={{ zIndex: 1 }}
                        pos={'absolute'}
                        bottom={-8}
                        right={isCurrentUser ? -8 : 'auto'}
                        left={!isCurrentUser ? -8 : 'auto'}
                        variant="filled"
                        color="grape.9"
                        w={8}
                        h={8}
                        p={0}
                        size={'xs'}
                        onClick={handleGenerateAudio}
                    >
                        <IconVolume width={16} height={16} />
                    </ActionIcon>
                    {lastUserId === message.user.id && (
                        <Flex
                            direction={isCurrentUser ? 'row' : 'row-reverse'}
                            justify={'center'}
                            align={'center'}
                            gap={4}
                        >
                            <MorseText size="xs" c="gray">
                                {message.user.name || message.user.email}
                            </MorseText>
                            <Avatar size={'sm'} src={message.user.avatar} />
                        </Flex>
                    )}
                    <Flex
                        direction={isCurrentUser ? 'row' : 'row-reverse'}
                        align={'end'}
                        gap={'xs'}
                    >
                        <MorseText
                            className="message-time"
                            size="xs"
                            c={'dark.4'}
                        >
                            {format(new Date(message.createdAt ?? new Date()))}
                        </MorseText>
                        <Menu.Target>
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
                        </Menu.Target>
                    </Flex>
                </Flex>
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
