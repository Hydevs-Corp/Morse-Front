import { Avatar, Box, Flex, Text } from '@mantine/core';
import { useAuth } from '../providers/useAuth';
import { useConversation } from './conversations/useConversation';
import ConvProfil from './ConvProfil';

const Participants = () => {
    const { history, currentConversationId } = useConversation();
    const { authStore } = useAuth();

    const participantsToDisplay =
        currentConversationId && history[currentConversationId]?.participants
            ? history[currentConversationId].participants.filter(
                  participant =>
                      parseInt(participant.id) !== parseInt(authStore.id)
              )
            : [];

    return (
        <div>
            {participantsToDisplay.length > 1 ? (
                participantsToDisplay.map(participant => (
                    <Box key={participant.id}>
                        <Flex
                            justify="flex-start"
                            align="flex-start"
                            direction="column"
                            wrap="wrap"
                            gap={'md'}
                            mb={'md'}
                        >
                            <ConvProfil
                                name={participant.name}
                                id={participant.id}
                                email={participant.email}
                            />
                        </Flex>
                    </Box>
                ))
            ) : (
                <Flex
                    gap="md"
                    justify="flex-start"
                    align="center"
                    direction="row"
                    wrap="wrap"
                >
                    <Avatar size={'xl'}></Avatar>
                    <Box>
                        {participantsToDisplay.map(participant => (
                            <Box key={participant.id}>
                                <Flex
                                    justify="flex-start"
                                    align="flex-start"
                                    direction="column"
                                    wrap="wrap"
                                >
                                    <Text>{participant.name}</Text>
                                    <Text c="grey">#{`${participant.id}`}</Text>
                                </Flex>
                            </Box>
                        ))}
                    </Box>
                </Flex>
            )}
        </div>
    );
};

export default Participants;
