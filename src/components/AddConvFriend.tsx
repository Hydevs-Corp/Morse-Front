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
import { useAuth } from '../providers/useAuth';
import type { User } from '../scripts/types/types';
import { useConversation } from './conversations/useConversation';
import MorseText from './morse/MorseText';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

let UsersList: User[] = [];

const AddConvFriend = ({ name, id, email }: User) => {
    const { authStore } = useAuth();
    const { isOnline } = useConversation();
    const [userList, setUserList] = useState<User[]>(UsersList);
    const [addUser, setAddUser] = useState<User | null>(null);

    const loginId = authStore?.id;

    const handleClick = () => {
        if (addUser) {
            console.log('User already added:', addUser);
            return;
        }

        const newUser: User = { id, name, email };
        userList.push(newUser);
        setAddUser(newUser);

        console.log('Added user to conversation:', newUser);
    };

    console.log('AddConvFriend', { name, id, email, loginId });
    console.log('UserList', userList);

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
                            <Avatar></Avatar>
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
                            <IconPlus />
                        </ActionIcon>
                    </Flex>
                </Box>
            </Flex>
        </Card>
    );
};

export default AddConvFriend;
