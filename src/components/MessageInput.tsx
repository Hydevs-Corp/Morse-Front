import { ActionIcon, Box, TextInput } from '@mantine/core';
import { IconSend2 } from '@tabler/icons-react';
import { useState } from 'react';
import useMorse from '../hook/useMorse';

interface MessageInputProps {
    onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
    const [field, setField] = useState({
        value: '',
        error: '',
    });
    const { handleRender } = useMorse();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (field.value.trim() === '') {
            setField({ value: '', error: 'Message cannot be empty' });
            return;
        }

        onSendMessage(field.value);
        setField({ value: '', error: '' });
    };

    return (
        <Box p={'xs'}>
            <form onSubmit={onSubmit}>
                <TextInput
                    placeholder={handleRender('Type your message here...')}
                    value={field.value}
                    onChange={e =>
                        setField({ value: e.target.value, error: '' })
                    }
                    error={field.error}
                    onKeyUp={e => {
                        if (
                            e.key === 'Enter' &&
                            !e.shiftKey &&
                            field.value.trim() !== ''
                        ) {
                            e.preventDefault();
                            onSubmit(e);
                        }
                    }}
                    rightSection={
                        <ActionIcon type="submit">
                            <IconSend2 />
                        </ActionIcon>
                    }
                />
            </form>
        </Box>
    );
};

export default MessageInput;
