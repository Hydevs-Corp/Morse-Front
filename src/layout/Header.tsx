import { Box, Button, Flex, Popover, Text, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useConversation } from '../components/conversations/useConversation';
import { UPDATE_CONV_NAME } from '../graphql/mutation/conversations';
import { useMutation } from '@apollo/client';

const Header = () => {
    const { history, currentConversationId, setConversationName } =
        useConversation();

    const [editedConversationName, setEditedConversationName] = useState('');

    const [updateConversationName, { loading, error }] = useMutation(
        UPDATE_CONV_NAME,
        {
            onCompleted: data => {
                const updatedConv = data.updateConversation;
                if (updatedConv && currentConversationId) {
                    setConversationName(
                        currentConversationId,
                        updatedConv.name
                    );
                    console.log(
                        'Conversation name updated successfully on the server!'
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
    }, [currentConversation]);

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
    console.log('Current conversation:', currentConversation?.name);
    console.log('Edited conversation name:', editedConversationName);

    return (
        <Flex
            gap="md"
            justify="flex-start"
            align="center"
            direction="row"
            wrap="wrap"
            w={'50%'}
            h={'100%'}
        >
            <Popover>
                <Popover.Target>
                    <Text ml={'sm'}>{editedConversationName !== '' ? editedConversationName : currentConversation?.name}</Text>
                </Popover.Target>
                <Popover.Dropdown>
                    <TextInput
                        placeholder="Edit conversation name"
                        value={editedConversationName}
                        onChange={event =>
                            setEditedConversationName(event.currentTarget.value)
                        }
                        style={{ flexGrow: 1, maxWidth: '300px' }}
                        disabled={loading}
                    />

                    <Button
                        onClick={handleSetNameClick}
                        disabled={!currentConversationId || loading}
                        loading={loading}
                    >
                        Save Name
                    </Button>
                </Popover.Dropdown>
            </Popover>
        </Flex>
    );
};

export default Header;
