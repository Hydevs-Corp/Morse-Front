import { ActionIcon, Avatar, Box, Card, Flex, Indicator } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import type { User } from '../scripts/types/types';
import { useConversation } from './conversations/useConversation';
import MorseText from './morse/MorseText';

const AddConvFriend = ({
    name,
    id,
    email,
    setUserList,
}: User & { setUserList: React.Dispatch<React.SetStateAction<User[]>> }) => {
    const { isOnline } = useConversation();

    const [addUser, setAddUser] = useState<User | null>(null);

    const handleClick = () => {
        setAddUser({ id: `${id}`, name, email });
        setUserList(prevUsers => {
            if (!prevUsers.find(user => user.id === `${id}`)) {
                return [...prevUsers, { id: `${id}`, name, email }];
            }
            return prevUsers;
        });
        addUser &&
            console.log(`User ${addUser.name} added to the conversation list.`);
    };

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
