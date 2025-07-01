import { gql } from '@apollo/client';
import { USER_FRAGMENT } from '../fragments/fragments';

const signup_MUTATE = gql`
    mutation Signup($email: String!, $password: String!, $name: String!) {
        signup(email: $email, password: $password, name: $name) {
            token
            user {
                ...UserFragment
            }
        }
    }
    ${USER_FRAGMENT}
`;

export default signup_MUTATE;
