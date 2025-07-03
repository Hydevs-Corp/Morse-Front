import { useMutation } from '@apollo/client';
import { ActionIcon, Flex, Popover, TextInput } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useConversation } from '../components/conversations/useConversation';
import MorseText from '../components/morse/MorseText';
import { UPDATE_CONV_NAME } from '../graphql/mutation/conversations';
import useConversationName from '../hook/UseConversationName';

const Header = () => {
    const { history, currentConversationId, setConversationName } =
        useConversation();
    const [editedConversationName, setEditedConversationName] = useState('');

    const getConversationName = useConversationName();

    const [updateConversationName, { loading }] = useMutation(
        UPDATE_CONV_NAME,
        {
            onCompleted: data => {
                const updatedConv = data.updateConversation;
                if (updatedConv && currentConversationId) {
                    setConversationName(
                        currentConversationId,
                        updatedConv.name
                    );
                }
            },
            onError: err => {
                console.error('Error updating conversation name:', err.message);
            },
        }
    );

    const currentConversation = currentConversationId
        ? history[currentConversationId]
        : null;

    useEffect(() => {
        if (currentConversation?.name) {
            setEditedConversationName(currentConversation.name);
        } else {
            setEditedConversationName('');
        }
    }, [currentConversation?.name]);

    const handleSetNameClick = () => {
        const trimmedName = editedConversationName.trim();

        if (currentConversationId && trimmedName !== '') {
            updateConversationName({
                variables: {
                    id: parseInt(currentConversationId),
                    name: trimmedName,
                },
            });
        } else if (!currentConversationId) {
            console.warn(
                'Cannot set conversation name: no current conversation selected.'
            );
        } else if (trimmedName === '') {
            console.warn('Cannot set conversation name: name is empty.');
        }
    };

    return (
        <>
            <Flex
                gap="md"
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
                w={'50%'}
                h={'100%'}
            >
                <Popover trapFocus position="bottom" withArrow shadow="md">
                    <Popover.Target>
                        <MorseText lineClamp={1} ml={'sm'}>
                            {getConversationName(currentConversationId)}
                        </MorseText>
                    </Popover.Target>
                    <Popover.Dropdown>
                        <Flex
                            gap="xs"
                            justify="flex-start"
                            align="center"
                            direction="row"
                            wrap="wrap"
                        >
                            <TextInput
                                placeholder="Edit conversation name"
                                value={editedConversationName}
                                onChange={event =>
                                    setEditedConversationName(
                                        event.currentTarget.value
                                    )
                                }
                                disabled={loading}
                            />
                            <ActionIcon
                                onClick={handleSetNameClick}
                                disabled={!currentConversationId || loading}
                                loading={loading}
                            >
                                <IconPencil />
                            </ActionIcon>
                        </Flex>
                    </Popover.Dropdown>
                </Popover>
            </Flex>
        </>
    );
};

export default Header;
