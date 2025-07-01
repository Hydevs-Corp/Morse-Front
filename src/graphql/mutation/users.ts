import { gql } from '@apollo/client';

export const SET_USER_ONLINE = gql`
    mutation SetUserOnline {
        setUserOnline
    }
`;

export const SET_USER_OFFLINE = gql`
    mutation SetUserOffline {
        setUserOffline
    }
`;
