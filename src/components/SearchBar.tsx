import { ActionIcon, Flex, Input } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';

const SearchBar = () => {
    const [value, setValue] = useState('');

    return (
        <>
            <Input
                placeholder="Search for someone..."
                value={value}
                onChange={event => setValue(event.currentTarget.value)}
                rightSection={
                    <Flex
                        gap="md"
                        justify="flex-start"
                        align="center"
                        direction="row"
                        wrap="wrap"
                    >
                        {value !== '' ? (
                            <Input.ClearButton onClick={() => setValue('')} />
                        ) : undefined}
                        <ActionIcon variant="transparent">
                            <IconSearch stroke={2} />
                        </ActionIcon>
                    </Flex>
                }
                rightSectionPointerEvents="auto"
                size="sm"
            />
        </>
    );
};

export default SearchBar;
