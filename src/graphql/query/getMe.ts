import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../fragments/fragments';

const getMe_QUERY = gql`
    query me {
        me {
            ...UserFragment
        }
    }
    ${USER_FRAGMENT}
`;

export default getMe_QUERY;
