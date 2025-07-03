import '@mantine/core/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { MantineProvider } from '@mantine/core';

import {
    ApolloClient,
    ApolloProvider,
    createHttpLink,
    InMemoryCache,
    split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createTheme, virtualColor } from '@mantine/core';
import '@mantine/notifications/styles.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Conversation from './pages/Conversation.tsx';
import FriendList from './pages/FriendList.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import Documentation from './components/Documentation.tsx';
const customTheme = createTheme({
    defaultRadius: '0.5rem',
    white: '#f5f1e6',
    black: '#4a3f35',
    primaryColor: 'primary',
    primaryShade: 5,
    defaultGradient: {
        from: '#d4c8aa',
        to: '#59493e',
        deg: 113,
    },
    colors: {
        primary: virtualColor({
            name: 'primary',
            dark: 'primarydark',
            light: 'primarylight',
        }),
        dark: [
            '#ece5d8',
            '#ece5d8',
            'rgba(214, 208, 197, 1)',
            '#c5bcac',
            '#4a4039',
            '#4a4039',
            '#3a322c',
            '#2d2621',
            'rgba(36, 30, 26, 1)',
            'blue',
        ],

        //light -mode
        gray: [
            '#e2d8c3',
            'rgba(235, 228, 213, 1)',
            '#ece5d8',
            '#dbd0ba',
            '#dbd0ba',
            '#7d6b56',
            'rgba(164, 151, 137, 1)',
            '#4a3f35',
            'red',
            '#4a3f35',
        ],
        primarylight: [
            'green',
            'green',
            'green',
            'green',
            'green',
            '#a67c52',
            'rgba(179, 144, 108, 1)',
            'green',
            'green',
            'green',
        ],
        primarydark: [
            '#ece5d8',
            '#c0a080',
            'yellow',
            '#c0a080',
            '#c0a080',
            '#c0a080',
            'rgba(163, 136, 109, 1)',
            'yellow',
            'yellow',
            'yellow',
        ],
    },
});

const httpLink = createHttpLink({
    uri: `${import.meta.env.VITE_API_URL}/graphql`,
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: `${import.meta.env.VITE_API_URL?.replace('http', 'ws')}/graphql`,
        connectionParams: () => {
            const token = localStorage.getItem('token');
            return {
                Authorization: token ? `Bearer ${token}` : '',
            };
        },
    })
);

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');

    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    authLink.concat(httpLink)
);

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
});

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/:id',
                element: <Conversation />,
            },
            {
                path: '/',
                element: <FriendList />,
            },
            {
                path: '/doc',
                element: <Documentation />,
            },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider defaultColorScheme="dark" theme={customTheme}>
            <ApolloProvider client={client}>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </ApolloProvider>
        </MantineProvider>
    </StrictMode>
);
