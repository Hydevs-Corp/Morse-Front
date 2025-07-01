import {
    ActionIcon,
    Box,
    Flex,
    Input,
    Paper,
    Skeleton,
    Text,
    Tooltip,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useAuth } from '../providers/useAuth';
import type { User } from '../scripts/types/types';
import AddConvFriend from './AddConvFriend';
import { IconMessageCirclePlus } from '@tabler/icons-react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router';
import { modals } from '@mantine/modals';

const CREATE_CONV = gql`
    mutation CreateConversation($participantIds: [Int!]!) {
        createConversation(participantIds: $participantIds) {
            id
            participants {
                id
                name
            }
        }
    }
`;

const GET_CONVERSATIONS = gql`
    query ConversationsByParticipant($participantIds: [Int!]!) {
        conversationsByParticipant(participantIds: $participantIds) {
            id
            participants {
                id
                name
            }
        }
    }
`;

const SearchModal = ({ users }: { users: User[] }) => {
    const [searchUser, setSearchUser] = useState('');
    const n = useNavigate();
    const [userList, setUserList] = useState<User[]>([]);
    const { authStore } = useAuth();
    const {
        loading: conversationLoading,
        error: conversationError,
        data: conversationData,
        refetch: conversationRefetch,
    } = useQuery<{
        conversationsByParticipant: { id: string }[];
    }>(GET_CONVERSATIONS, {
        variables: {
            participantIds: [],
        },
        onError: error => {
            console.error('Error fetching conversations:', error);
        },
    });

    useEffect(() => {
        console.log('Refetching conversations with userList:', userList);
        conversationRefetch({
            participantIds: [
                ...userList.map(user => parseInt(user.id)),
                parseInt(authStore.id),
            ],
        });
    }, [conversationRefetch, userList, authStore.id]);

    const [mutateFunction, { loading, error }] = useMutation(CREATE_CONV, {
        onCompleted: data => {
            n(`/${data.createConversation.id}`);
        },
        onError: error => {
            console.error('Error creating conversation:', error);
        },
    });
    const loginId = authStore?.id;

    const handleClick = () => {
        console.log('Start a new conversation clicked');
        const idExists =
            !!conversationData?.conversationsByParticipant?.[0]?.id;
        console.log(
            'Conversation ID exists:',
            conversationData?.conversationsByParticipant
        );
        if (idExists) {
            console.log('Conversation already exists, navigating to it');
            n(`/${conversationData.conversationsByParticipant[0].id}`);
            return;
        } else {
            console.log('Creating a new conversation');
            mutateFunction({
                variables: {
                    participantIds: [
                        parseInt(loginId),
                        ...userList.map(user => parseInt(user.id)),
                    ],
                },
            });
        }
        modals.closeAll();
    };

    if (loading || conversationLoading) {
        return (
            <Paper shadow="xs" p="xs">
                <Flex
                    gap="md"
                    justify="space-between"
                    align="center"
                    direction="row"
                    wrap="wrap"
                >
                    <Box>
                        <Flex
                            gap="md"
                            justify="flex-start"
                            align="center"
                            direction="row"
                            wrap="wrap"
                        >
                            <Skeleton height={40} circle />
                            <Box>
                                <Skeleton height={16} width={120} radius="xl" />
                                <Skeleton
                                    height={12}
                                    mt={4}
                                    width={60}
                                    radius="xl"
                                />
                            </Box>
                        </Flex>
                    </Box>
                    <Box>
                        <Skeleton height={40} width={40} radius="xl" />
                    </Box>
                </Flex>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper shadow="xs" p="xs" bg="red.0">
                <Text c="red">
                    Error creating conversation: {error.message}
                </Text>
            </Paper>
        );
    }

    if (conversationError) {
        return (
            <Paper shadow="xs" p="xs" bg="red.0">
                <Text c="red">
                    Error fetching conversations: {conversationError.message}
                </Text>
            </Paper>
        );
    }
    return (
        <Flex direction="column" gap="md">
            <Input
                placeholder="Search for a user"
                value={searchUser}
                onChange={e => setSearchUser(e.currentTarget.value)}
            />
            <Box>
                {userList.map(User => <Text key={User.id}>{User.name}</Text>) ||
                    'No users found'}
            </Box>
            <Flex direction="column" gap="xs">
                {users
                    .filter((user: User) => `${user.id}` !== authStore.id)
                    .filter((user: User) =>
                        user.name
                            .toLowerCase()
                            .includes(searchUser.toLowerCase())
                    )
                    .map((user: User) => (
                        <AddConvFriend
                            setUserList={setUserList}
                            {...user}
                            key={user.id}
                        />
                    ))}
            </Flex>
            <Flex
                gap="md"
                justify="flex-end"
                align="center"
                direction="row"
                wrap="wrap"
                mr={'md'}
            >
                <Tooltip label="Start a new conversation" withArrow>
                    <ActionIcon
                        variant="primary"
                        size="xl"
                        aria-label="action icon"
                        onClick={handleClick}
                    >
                        <IconMessageCirclePlus />
                    </ActionIcon>
                </Tooltip>
            </Flex>
        </Flex>
    );
};

export default SearchModal;
