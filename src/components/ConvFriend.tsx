import {
    ActionIcon,
    Avatar,
    Box,
    Card,
    Flex,
    Indicator,
    type MantineColor,
} from '@mantine/core';
import type { ReactNode } from 'react';
import type { User } from '../scripts/types/types';
import { useConversation } from './conversations/useConversation';
import MorseText from './morse/MorseText';

const ConvFriend = ({
    name,
    id,
    email,
    icon,
    action,
    actionColor,
}: User & {
    action: (user: User) => void;
    icon: ReactNode;
    actionColor?: MantineColor;
}) => {
    const { isOnline } = useConversation();

    const handleClick = () => {
        action({ name, id, email });
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
                            size={'xl'}
                            color={actionColor}
                            onClick={handleClick}
                        >
                            {icon}
                        </ActionIcon>
                    </Flex>
                </Box>
            </Flex>
        </Card>
    );
};

export default ConvFriend;
