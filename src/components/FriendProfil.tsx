import { gql, useMutation, useQuery } from '@apollo/client';
import {
    ActionIcon,
    Avatar,
    Box,
    Card,
    Flex,
    Indicator,
    Paper,
    Skeleton,
    Text,
} from '@mantine/core';
import { IconMessageCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../providers/useAuth';
import type {
    User,
    GetConversationsByParticipantResponse,
} from '../scripts/types/types';
import { useConversation } from './conversations/useConversation';
import MorseText from './morse/MorseText';
import { CREATE_CONV } from '../graphql/mutation/conversations';

const GET_CONVERSATIONS = gql`
    query ConversationsByParticipant($participantIds: [Int!]!) {
        conversationsByParticipant(participantIds: $participantIds) {
            id
        }
    }
`;

const FriendProfil = ({ name, id, email, avatar }: User) => {
    const { authStore } = useAuth();
    const n = useNavigate();
    const { isOnline } = useConversation();
    const {
        loading: conversationLoading,
        error: conversationError,
        data: conversationData,
    } = useQuery<GetConversationsByParticipantResponse>(GET_CONVERSATIONS, {
        variables: {
            participantIds: [parseInt(authStore?.id), parseInt(id)],
        },
        onError: error => {
            console.error('Error fetching conversations:', error);
        },
    });
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
                    participantIds: [parseInt(loginId), parseInt(id)],
                },
            });
        }
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
        <Card shadow="xs">
            <Flex
                gap="md"
                justify="space-between"
                align="center"
                direction="row"
                wrap="wrap"
            >
                <Box>
                    <Flex
                        gap="xs"
                        justify="flex-start"
                        align="center"
                        direction="row"
                        wrap="wrap"
                    >
                        <Indicator
                            color={isOnline(id) ? 'lime' : 'red'}
                            position="bottom-end"
                            size={10}
                            offset={5}
                        >
                            <Avatar src={avatar} />
                        </Indicator>
                        <Box>
                            <MorseText>
                                <MorseText span mr={4}>
                                    {name}
                                </MorseText>
                                <MorseText span c="grey">
                                    #{id}
                                </MorseText>
                            </MorseText>
                            <MorseText span c="grey" size="xs">
                                {email}
                            </MorseText>
                        </Box>
                    </Flex>
                </Box>
                <Box>
                    <Flex
                        gap="md"
                        justify="flex-start"
                        align="center"
                        direction="row"
                        wrap="wrap"
                    >
                        <ActionIcon
                            variant="primary"
                            size="xl"
                            aria-label="action icon"
                            onClick={handleClick}
                        >
                            <IconMessageCircle />
                        </ActionIcon>
                    </Flex>
                </Box>
            </Flex>
        </Card>
    );
};

export default FriendProfil;
