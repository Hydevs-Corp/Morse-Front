import { useQuery } from '@apollo/client';
import {
    ActionIcon,
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    Flex,
    NavLink,
    Popover,
    Slider,
    Text,
    Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
    IconDeviceFloppy,
    IconLogout,
    IconPencil,
    IconUsers,
} from '@tabler/icons-react';
import { useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router';
import ButtonLogin from '../components/auth/ButtonLogin';
import ButtonRegister from '../components/auth/ButtonRegister';
import MorseInput from '../components/morse/MorseInput';
import MorseText from '../components/morse/MorseText';
import MorseTooltip from '../components/morse/MorseTooltip';
import { GetMyConversation } from '../graphql/query/getMyConversations';
import { useAuth } from '../providers/useAuth';
import { useSettings } from '../providers/useSettings';

const Navbar = () => {
    const { authStore, logout, updateUser, state } = useAuth();
    const { settings, updateSettings } = useSettings();
    const { data } = useQuery(GetMyConversation);
    const [modifyUser, setModifyUser] = useState(false);

    const form = useForm({
        initialValues: {
            name: authStore.name,
        },
    });

    return (
        <Flex
            direction={'column'}
            justify="space-between"
            align="center"
            w={'100%'}
            h={'100%'}
        >
            <Flex>
                <MorseText size="xl" p="md">
                    Morse App
                </MorseText>
            </Flex>
            <Flex direction={'column'} w={'100%'} h={'100%'} flex={1}>
                {authStore.id && (
                    <Flex
                        justify="center"
                        align="center"
                        direction="row"
                        wrap="wrap"
                    >
                        <Button
                            leftSection={<IconUsers stroke={2} />}
                            component={RouterNavLink}
                            to="/"
                            variant="light"
                            w={'90%'}
                            mb={8}
                        >
                            <MorseText>Friend List</MorseText>
                        </Button>
                    </Flex>
                )}
                {data?.getMyConversations.map(
                    (conversation: {
                        id: string;
                        participants: { name: string; email: string }[];
                    }) => (
                        <NavLink
                            key={conversation.id}
                            component={RouterNavLink}
                            to={`/${conversation.id}`}
                            label={
                                <MorseText>
                                    {conversation.participants
                                        .filter(
                                            participant =>
                                                authStore.email !==
                                                participant.email
                                        )
                                        .reduce(
                                            (acc, curr) =>
                                                !acc
                                                    ? curr.name
                                                    : (acc += ', ' + curr.name),
                                            ''
                                        ) ?? 'Conversation'}
                                </MorseText>
                            }
                        />
                    )
                )}
            </Flex>
            <Box w={'100%'}>
                {authStore?.token && (
                    <Popover width={'285'}>
                        <Popover.Target>
                            <Card p="xs" m={8}>
                                <Flex
                                    direction={'row'}
                                    justify="space-between"
                                    align="center"
                                    gap={8}
                                >
                                    <Flex
                                        direction={'row'}
                                        align="center"
                                        gap={8}
                                    >
                                        <Avatar />
                                        <MorseText>{authStore.name}</MorseText>
                                        <Text c={'grey'}>#{authStore.id}</Text>
                                    </Flex>
                                    <Tooltip
                                        transitionProps={{ duration: 200 }}
                                        label="Logout"
                                        color="red"
                                    >
                                        <ActionIcon
                                            variant="primary"
                                            size="xl"
                                            aria-label="action icon"
                                            onClick={logout}
                                        >
                                            <IconLogout />
                                        </ActionIcon>
                                    </Tooltip>
                                </Flex>
                            </Card>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Flex direction={'column'} gap={16}>
                                <div>
                                    <Flex
                                        w={'100%'}
                                        gap={8}
                                        justify={'space-between'}
                                    >
                                        <MorseText>User account</MorseText>
                                        {modifyUser ? (
                                            <MorseTooltip label="Save">
                                                <ActionIcon
                                                    variant="primary"
                                                    size="sm"
                                                    loading={
                                                        state.updateUser.loading
                                                    }
                                                    onClick={() => {
                                                        if (
                                                            form.values.name ===
                                                            authStore.name
                                                        ) {
                                                            setModifyUser(
                                                                false
                                                            );
                                                            return;
                                                        }
                                                        updateUser(
                                                            form.values.name
                                                        );
                                                        setModifyUser(false);
                                                    }}
                                                >
                                                    <IconDeviceFloppy />
                                                </ActionIcon>
                                            </MorseTooltip>
                                        ) : (
                                            <MorseTooltip label="Modify user">
                                                <ActionIcon
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() =>
                                                        setModifyUser(true)
                                                    }
                                                >
                                                    <IconPencil />
                                                </ActionIcon>
                                            </MorseTooltip>
                                        )}
                                    </Flex>
                                    <Divider
                                        my={4}
                                        color="#4a4039"
                                        h={1}
                                        w={'100%'}
                                    />
                                    <Flex direction={'column'} gap={8}>
                                        <MorseInput
                                            label="Name"
                                            // defaultValue={authStore.name}
                                            disabled={!modifyUser}
                                            {...form.getInputProps('name')}
                                        />
                                        <MorseInput
                                            label="Email"
                                            defaultValue={authStore.email}
                                            disabled={true}
                                        />
                                        <MorseInput
                                            label="ID"
                                            defaultValue={authStore.id}
                                            disabled={true}
                                        />
                                    </Flex>
                                </div>
                                <div>
                                    <MorseText>Settings</MorseText>
                                    <Divider
                                        my={4}
                                        color="#4a4039"
                                        h={1}
                                        w={'100%'}
                                    />
                                    <Flex direction={'column'} gap={8}>
                                        <div>
                                            <MorseText mih={'12'}>
                                                Morse percentage
                                            </MorseText>
                                            <Slider
                                                label="Morse percentage"
                                                min={0}
                                                max={100}
                                                step={1}
                                                defaultValue={
                                                    settings.morsePercent ?? 0
                                                }
                                                onChange={value => {
                                                    updateSettings({
                                                        morsePercent: value,
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <MorseText>Volume</MorseText>
                                            <Slider
                                                label="Volume"
                                                min={0}
                                                max={100}
                                                step={5}
                                                defaultValue={
                                                    settings.volume * 100 || 0
                                                }
                                                onChange={value => {
                                                    updateSettings({
                                                        volume: value / 100,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </Flex>
                                </div>
                            </Flex>
                        </Popover.Dropdown>
                    </Popover>
                )}
                {!authStore?.token && (
                    <Flex
                        direction={'row'}
                        justify="space-between"
                        align="center"
                        w={'100%'}
                        p="md"
                        gap={4}
                    >
                        <Card>
                            <ButtonLogin />
                            <ButtonRegister />
                        </Card>
                    </Flex>
                )}
            </Box>
        </Flex>
    );
};

export default Navbar;
