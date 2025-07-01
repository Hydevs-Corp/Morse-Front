import { gql } from '@apollo/client';

const signin_MUTATE = gql(`
    mutation Signin($email: String!, $password: String!) {
  signin(email: $email, password: $password)
}
`);

export default signin_MUTATE;
