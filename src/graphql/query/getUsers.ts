import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../fragments/fragments';

const getUsers_QUERY = gql`
    query GetUsers {
        users {
            ...UserFragment
        }
    }
    ${USER_FRAGMENT}
`;

export default getUsers_QUERY;
