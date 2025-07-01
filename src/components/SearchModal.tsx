import { Box, Flex, Input, Text } from '@mantine/core';
import { useState } from 'react';
import { useAuth } from '../providers/useAuth';
import type { User } from '../scripts/types/types';
import AddConvFriend from './AddConvFriend';

const SearchModal = ({ users }: { users: User[] }) => {
    const [searchUser, setSearchUser] = useState('');
    const [userList, setUserList] = useState<User[]>([]);
    const { authStore } = useAuth();
    return (
        <Flex direction="column" gap="md">
            <Input
                placeholder="Search for a user"
                value={searchUser}
                onChange={e => setSearchUser(e.currentTarget.value)}
            />
            <Box>
                {userList.map(User => <Text key={User.id}>{User.name}</Text>) ||
                    'No users found'}
            </Box>
            <Flex direction="column" gap="xs">
                {users
                    .filter((user: User) => `${user.id}` !== authStore.id)
                    .filter((user: User) =>
                        user.name
                            .toLowerCase()
                            .includes(searchUser.toLowerCase())
                    )
                    .map((user: User) => (
                        <AddConvFriend
                            setUserList={setUserList}
                            {...user}
                            key={user.id}
                        />
                    ))}
            </Flex>
        </Flex>
    );
};

export default SearchModal;
