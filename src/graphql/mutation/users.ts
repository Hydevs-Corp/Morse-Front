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

export const UPDATE_USER = gql`
    mutation updateUser($name: String!, $avatar: String) {
        updateUser(name: $name, avatar: $avatar) {
            email
            id
            name
            avatar
        }
    }
`;
