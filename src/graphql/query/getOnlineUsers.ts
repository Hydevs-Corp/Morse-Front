import { gql } from '@apollo/client';

export const GET_ONLINE_USERS = gql`
    query GetOnlineUsers {
        getOnlineUsers {
            online {
                userId
                lastConnection
            }
        }
    }
`;
