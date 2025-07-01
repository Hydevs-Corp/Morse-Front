import { gql } from '@apollo/client';

const getUsers_QUERY = gql`
    query GetUsers {
        users {
            id
            name
        }
    }
`;

export default getUsers_QUERY;
