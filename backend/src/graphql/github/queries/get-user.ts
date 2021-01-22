import gql from 'graphql-tag';

export const getUserQuery = gql`query GetUser($login: String!) {
  user(login: $login) {
    login
    name
    url
  }
}
`;

export interface User {
  login: string;
  name: string | null;
  url: string;
}

export interface GetUserQueryResult {
  user: User
}
