import {
    ActionIcon,
    Affix,
    AppShell,
    Button,
    Card,
    Drawer,
    Flex,
    Title,
} from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Outlet, useParams } from 'react-router';
import './App.css';
import ButtonLogin from './components/auth/ButtonLogin';
import ButtonRegister from './components/auth/ButtonRegister';
import Aside from './layout/Aside';
import Navbar from './layout/Navbar';
import ConversationProvider from './providers/ConversationProvider';
import { SettingsProvider } from './providers/SettingsProviders';
import { useAuth } from './providers/useAuth';
import Header from './layout/Header';
import Documentation from './components/Documentation';
import { IconFile } from '@tabler/icons-react';

function App() {
    const [opened] = useDisclosure();
    const [openedDrawer, drawerHandlers] = useDisclosure(false);
    const { authStore } = useAuth();
    const params = useParams();
    const { width } = useViewportSize();

    return (
        <>
            <SettingsProvider>
                <ModalsProvider>
                    <ConversationProvider>
                        <Notifications />
                        {!authStore?.token ? (
                            <Flex
                                w="100%"
                                h="100vh"
                                p="md"
                                align={'center'}
                                justify="center"
                            >
                                <Card>
                                    <Title order={1}>Welcome to Morse</Title>
                                    <Flex
                                        direction={'row'}
                                        justify="center"
                                        align="center"
                                        p="md"
                                        gap={4}
                                    >
                                        <ButtonLogin />
                                        <ButtonRegister />
                                    </Flex>
                                </Card>
                            </Flex>
                        ) : (
                            <AppShell
                                layout="alt"
                                header={{
                                    height: params.id ? 40 : 0,
                                }}
                                navbar={{
                                    width: 300,
                                    breakpoint: 'sm',
                                    collapsed: { mobile: !opened },
                                }}
                                aside={{
                                    width: 300,
                                    breakpoint: 'md',
                                    collapsed: {
                                        desktop: !params.id,
                                        mobile: true,
                                    },
                                }}
                            >
                                {params.id && (
                                    <AppShell.Header>
                                        <Header />
                                    </AppShell.Header>
                                )}
                                <AppShell.Navbar>
                                    <Navbar />
                                </AppShell.Navbar>

                                <AppShell.Main
                                    style={{
                                        backgroundImage: 'url(/image2.png)',
                                        backgroundPosition: 'bottom right',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPositionX:
                                            'calc(100% - var(--app-shell-aside-offset, 0rem))',
                                    }}
                                >
                                    <Outlet />
                                    <Affix
                                        position={{
                                            bottom: width > 991 ? 10 : 60,
                                            right: 20,
                                        }}
                                    >
                                        <ActionIcon
                                            onClick={() =>
                                                drawerHandlers.open()
                                            }
                                        >
                                            <IconFile />
                                        </ActionIcon>
                                    </Affix>
                                    <Drawer
                                        opened={openedDrawer}
                                        onClose={() => drawerHandlers.close()}
                                        title="Documentation"
                                        size={800}
                                        position="right"
                                        zIndex={1000}
                                    >
                                        <Documentation />
                                    </Drawer>
                                </AppShell.Main>
                                {params.id && (
                                    <AppShell.Aside p="md">
                                        <Aside />
                                    </AppShell.Aside>
                                )}
                            </AppShell>
                        )}
                    </ConversationProvider>
                </ModalsProvider>
            </SettingsProvider>
        </>
    );
}

export default App;
