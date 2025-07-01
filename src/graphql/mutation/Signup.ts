import { gql } from '@apollo/client';

const signup_MUTATE = gql(`
mutation Signup ($email: String!, $password: String!, $name: String!){
    signup(email: $email, password: $password, name:$name) {
      token
      user {
        email
        id
        name
      }
    }
  }
  `);
export default signup_MUTATE;
