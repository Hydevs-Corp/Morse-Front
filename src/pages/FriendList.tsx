import { useQuery } from '@apollo/client';
import { ActionIcon, Flex, Tooltip } from '@mantine/core';
import { IconMessageCirclePlus } from '@tabler/icons-react';
import FriendProfil from '../components/FriendProfil';
import getUsers_QUERY from '../graphql/query/getUsers';
import { useAuth } from '../providers/useAuth';
import type { User } from '../scripts/types/types';
import { modals } from '@mantine/modals';
import SearchModal from '../components/SearchModal';
interface QueryResult {
    users: User[];
}

const FriendList = () => {
    const { authStore } = useAuth();
    const { loading, error, data } = useQuery<QueryResult>(getUsers_QUERY);
    if (authStore?.id === '') {
        return <div>Please log in to see your friends.</div>;
    }

    const open = () => {
        modals.open({
            title: 'Start a new conversation',
            children: <SearchModal users={data?.users ?? []} />,
        });
    };

    if (loading) return 'Loading...';
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
