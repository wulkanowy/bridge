import gql from 'graphql-tag';

export default gql`query GetLoginState {
  loginState {
    name
    avatarUrl
    login
  }
}`;
