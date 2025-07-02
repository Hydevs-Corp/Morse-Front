import { Avatar, Box, Card, Flex, Indicator } from '@mantine/core';
import type { User } from '../scripts/types/types';
import { useConversation } from './conversations/useConversation';
import MorseText from './morse/MorseText';

const ConvProfil = ({ name, id, email }: User) => {
    const { isOnline } = useConversation();

    return (
        <Card p={'xs'} shadow="xs" w={'100%'} >
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
            </Flex>
        </Card>
    );
};

export default ConvProfil;
