import { useQuery } from '@apollo/client';
import { ActionIcon, Box, Flex, Loader, Tooltip } from '@mantine/core';
import { IconMessageCirclePlus } from '@tabler/icons-react';
import FriendProfil from '../components/FriendProfil';
import getUsers_QUERY from '../graphql/query/getUsers';
import { useAuth } from '../providers/useAuth';
import type { GetUsersResponse, User } from '../scripts/types/types';
import { modals } from '@mantine/modals';
import SearchModal from '../components/SearchModal';
import { useEffect } from 'react';

const FriendList = () => {
    const { authStore } = useAuth();
    const { loading, error, data, refetch } =
        useQuery<GetUsersResponse>(getUsers_QUERY);
    useEffect(() => {
        if (authStore?.id) {
            refetch();
        }
    }, [authStore?.id, refetch]);

    if (authStore?.id === '') {
        return <Box p={'md'}>Please log in to see your friends.</Box>;
    }

    const open = () => {
        modals.open({
            title: 'Start a new conversation',
            children: <SearchModal users={data?.users ?? []} />,
        });
    };

    if (loading)
        return (
            <Flex p={'md'} justify="center" align="center">
                <Loader size="xl" variant="dots" />
            </Flex>
        );
    if (error) return `Error! ${error.message}`;
    return (
        <Flex gap={'xs'} direction={'column'} p={'xs'}>
            <Flex
                gap="md"
                justify="flex-end"
                align="center"
                direction="row"
                wrap="wrap"
                mr={'md'}
            >
                <Tooltip label="Start a new conversation" withArrow>
                    <ActionIcon
                        variant="primary"
                        size="xl"
                        aria-label="action icon"
                        onClick={open}
                    >
                        <IconMessageCirclePlus />
                    </ActionIcon>
                </Tooltip>
            </Flex>
            {data?.users
                .filter((user: User) => `${user.id}` !== authStore.id)
                .map((user: User) => <FriendProfil {...user} key={user.id} />)}
        </Flex>
    );
};

export default FriendList;
