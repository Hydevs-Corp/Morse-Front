import {
    ActionIcon,
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    FileInput,
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
import { useConversation } from '../components/conversations/useConversation';
import MorseInput from '../components/morse/MorseInput';
import MorseText from '../components/morse/MorseText';
import MorseTooltip from '../components/morse/MorseTooltip';
import useConversationName from '../hook/UseConversationName';
import { useAuth } from '../providers/useAuth';
import { useSettings } from '../providers/useSettings';
import { notifications } from '@mantine/notifications';

const objectKeys = Object.keys as <T extends object>(obj: T) => (keyof T)[];

const Navbar = () => {
    const { authStore, logout, updateUser, state } = useAuth();
    const { settings, updateSettings } = useSettings();
    const [modifyUser, setModifyUser] = useState(false);
    const { history } = useConversation();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const getConversationName = useConversationName();

    const form = useForm({
        initialValues: {
            name: authStore.name,
            avatar: authStore.avatar || '',
        },
    });

    const handleFileChange = (file: File | null) => {
        setAvatarFile(file);
    };

    const handleUpdateAvatar = () => {
        if (avatarFile && avatarFile.size > 2 * 1024 * 1024) {
            notifications.show({
                title: 'File too large',
                message: 'Please upload an image smaller than 2MB.',
                color: 'red',
            });
            return;
        }
        if (avatarFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                if (typeof base64String !== 'string') {
                    console.error('FileReader did not return a string');
                    return;
                }
                updateUser(form.values.name, base64String);
                setModifyUser(false);
            };
            reader.readAsDataURL(avatarFile);
        } else {
            updateUser(form.values.name, form.values.avatar);
            setModifyUser(false);
        }
    };

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
                {objectKeys(history).map(conversationId => (
                    <NavLink
                        key={conversationId}
                        component={RouterNavLink}
                        to={`/${conversationId}`}
                        label={
                            <MorseText>
                                {getConversationName(conversationId)}
                            </MorseText>
                        }
                    />
                ))}
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
                                        <Flex>
                                            <Avatar src={authStore.avatar} />
                                        </Flex>
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
                                                    onClick={handleUpdateAvatar}
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
                                            disabled={!modifyUser}
                                            {...form.getInputProps('name')}
                                        />
                                        <FileInput
                                            label="Avatar"
                                            placeholder="Upload avatar"
                                            accept="image/*"
                                            disabled={!modifyUser}
                                            onChange={handleFileChange}
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
                                                    settings.volume || 0
                                                }
                                                onChange={value => {
                                                    updateSettings({
                                                        volume: value,
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
