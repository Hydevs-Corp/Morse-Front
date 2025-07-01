import { gql } from '@apollo/client';

const getMe_QUERY = gql`
    query me {
        me {
            email
            name
            id
        }
    }
`;

export default getMe_QUERY;
