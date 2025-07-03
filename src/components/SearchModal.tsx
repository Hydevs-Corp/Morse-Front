import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Flex, Paper, Skeleton, Text, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import {
    IconMessageCirclePlus,
    IconMinus,
    IconPlus,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../providers/useAuth';
import type { User } from '../scripts/types/types';
import ConvFriend from './ConvFriend';
import MorseButton from './morse/MorseButton';
import MorseText from './morse/MorseText';

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
        const idExists =
            !!conversationData?.conversationsByParticipant?.[0]?.id;

        if (idExists) {
            n(`/${conversationData.conversationsByParticipant[0].id}`);
            return;
        } else {
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

    const potentialUsers = users
        .filter((user: User) => `${user.id}` !== authStore.id)
        .filter(
            (user: User) =>
                user.name.toLowerCase().includes(searchUser.toLowerCase()) &&
                userList.find(u => u.id === user.id) === undefined
        );

    return (
        <Flex direction="column">
            <TextInput
                placeholder="Search for a user"
                value={searchUser}
                onChange={e => setSearchUser(e.currentTarget.value)}
                mb={'xs'}
            />
            <Flex direction="column" gap="xs">
                {userList.length > 0 && (
                    <MorseText c="grey">
                        Users added to the conversation:
                    </MorseText>
                )}
                {userList.map(user => (
                    <ConvFriend
                        actionColor="red"
                        icon={<IconMinus />}
                        action={user =>
                            setUserList(prev =>
                                prev.filter(u => u.id !== user.id)
                            )
                        }
                        {...user}
                        key={user.id}
                    />
                ))}
            </Flex>
            <Flex direction="column" gap="xs">
                {potentialUsers.length === 0 ? (
                    <MorseText mt={'xs'} c="grey">
                        No users left to add {':)'}
                    </MorseText>
                ) : (
                    <MorseText mt={'xs'} c="grey">
                        Potential users to add:
                    </MorseText>
                )}
                {potentialUsers.map((user: User) => (
                    <ConvFriend
                        action={user => {
                            if (!userList.find(u => u.id === user.id)) {
                                setUserList(prevUsers => [...prevUsers, user]);
                            }
                        }}
                        icon={<IconPlus />}
                        {...user}
                        key={user.id}
                    />
                ))}
            </Flex>
            <Flex gap="md" mt={'xs'} justify="flex-end">
                <MorseButton
                    onClick={handleClick}
                    rightSection={<IconMessageCirclePlus />}
                >
                    Start a new conversation
                </MorseButton>
            </Flex>
        </Flex>
    );
};

export default SearchModal;
